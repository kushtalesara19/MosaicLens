export function formatINR(amount) {
  if (!amount || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function computeMetrics(reviews) {
  if (!reviews || reviews.length === 0) {
    return {
      totalLTVAtRisk: 0,
      urgentChurnLTV: 0,
      responseGapPct: 0,
      issueStats: [],
      topCoOccurrences: [],
      productBreakdown: [],
      platformBreakdown: [],
    };
  }

  let totalLTVAtRisk = 0;
  let urgentChurnLTV = 0;
  
  // Variables for Response Gap
  let highValueAngryCount = 0;
  let highValueIgnoredCount = 0;
  const highValuePlatformStats = {};

  const issueMap = {};
  const productRiskMap = {};
  const platformRiskMap = {};
  const coOccurrenceCounts = {};

  reviews.forEach((review) => {
    // Defensive parsing for values
    const rating = Number(review.rating) || 0;
    const ltv = Number(review.customer_ltv) || 0;
    const platform = review.platform || 'Unknown';
    const product = review.product || 'Unknown';
    const helpfulVotes = Number(review.helpful_votes) || 0;
    const responseFromBrand = Number(review.response_from_brand) || 0;
    const daysSincePurchase = Number(review.days_since_purchase) || 999;
    
    const isAngry = rating <= 2;
    const isRepeat = Number(review.is_repeat_customer) === 1;
    const isUrgent = daysSincePurchase <= 30;

    // Total LTV at risk formula
    if (isAngry && isRepeat) {
      totalLTVAtRisk += ltv;
      if (isUrgent) {
        urgentChurnLTV += ltv;
      }
    }

    // Response gap formula
    if (isAngry && isRepeat && ltv > 10000) {
      highValueAngryCount++;
      const pOwnership = platform === 'D2C Website' ? 'Mosaic owns this' : 'Partner owns this';
      if (!highValuePlatformStats[platform]) {
        highValuePlatformStats[platform] = { complaints: 0, responses: 0, ownership: pOwnership };
      }
      highValuePlatformStats[platform].complaints++;

      if (responseFromBrand === 0) {
        highValueIgnoredCount++;
      } else {
        highValuePlatformStats[platform].responses++;
      }
    }

    // Handle detected_issues (might be a JSON string like "[]" or an actual array)
    let issues = [];
    try {
      if (typeof review.detected_issues === 'string' && review.detected_issues.trim()) {
        issues = JSON.parse(review.detected_issues);
      } else if (Array.isArray(review.detected_issues)) {
        issues = review.detected_issues;
      }
    } catch (e) {
      // If parsing fails, it's not an array-like string, skip issues for this review
    }

    // Issue Co-occurrence formula
    if (issues && Array.isArray(issues) && issues.length > 1) {
      const sortedIssues = [...issues].sort();
      for (let i = 0; i < sortedIssues.length; i++) {
        for (let j = i + 1; j < sortedIssues.length; j++) {
          const pairKey = `${sortedIssues[i]}|${sortedIssues[j]}`;
          coOccurrenceCounts[pairKey] = (coOccurrenceCounts[pairKey] || 0) + 1;
        }
      }
    }

    // Process each detected issue for per-issue metrics
    if (issues && Array.isArray(issues)) {
      issues.forEach((issue) => {
        if (!issueMap[issue]) {
          issueMap[issue] = {
            id: issue,
            name: issue.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            complaint_count: 0,
            sum_ltv: 0,
            total_ltv_at_risk: 0,
            repeat_customer_count: 0,
            sum_rating: 0,
            sum_helpful_votes: 0,
            response_count: 0,
            platform_stats: {},
            reviews: [],
          };
        }

        const iStat = issueMap[issue];
        iStat.complaint_count++;
        iStat.sum_ltv += ltv;
        iStat.sum_rating += rating;
        iStat.sum_helpful_votes += helpfulVotes;
        
        if (isRepeat) {
          iStat.repeat_customer_count++;
        }
        if (isAngry && isRepeat) {
          iStat.total_ltv_at_risk += ltv;
        }
        if (responseFromBrand === 1) {
          iStat.response_count++;
        }

        if (!iStat.platform_stats[platform]) {
          iStat.platform_stats[platform] = {
            count: 0,
            ltv_risk: 0,
            ownership: platform === 'D2C Website' ? 'Mosaic owns this' : 'Partner owns this'
          };
        }
        iStat.platform_stats[platform].count++;
        if (isAngry && isRepeat) {
          iStat.platform_stats[platform].ltv_risk += ltv;
        }

        iStat.reviews.push(review);
      });
    }

    // Product breakdown
    if (isAngry) {
      productRiskMap[product] = (productRiskMap[product] || 0) + (isRepeat ? ltv : 0);
    }

    // Platform breakdown
    if (isAngry) {
      const pOwnership = platform === 'D2C Website' ? 'Mosaic owns this' : 'Partner owns this';
      if (!platformRiskMap[platform]) {
        platformRiskMap[platform] = { ltv: 0, ownership: pOwnership };
      }
      platformRiskMap[platform].ltv += (isRepeat ? ltv : 0);
    }
  });

  // Finalize issue stats
  const issueStats = Object.values(issueMap).map((stat) => {
    const avg_helpful_votes = stat.sum_helpful_votes / stat.complaint_count;
    
    // Validated LTV formula: weighting LTV by helpful votes
    // WHY: If an issue gets high helpful votes, it means many silent readers agree.
    // The stated financial impact is a floor, not a ceiling. We scale it up by 2% per helpful vote (avg/50).
    const validated_ltv = stat.total_ltv_at_risk * (1 + avg_helpful_votes / 50);

    return {
      id: stat.id,
      name: stat.name,
      complaint_count: stat.complaint_count,
      avg_ltv: stat.sum_ltv / stat.complaint_count,
      total_ltv_at_risk: stat.total_ltv_at_risk,
      pct_repeat_customers: Math.round((stat.repeat_customer_count / stat.complaint_count) * 100),
      avg_rating: (stat.sum_rating / stat.complaint_count).toFixed(1),
      avg_helpful_votes: Math.round(avg_helpful_votes),
      validated_ltv: validated_ltv,
      brand_response_pct: Math.round((stat.response_count / stat.complaint_count) * 100),
      platform_stats: Object.entries(stat.platform_stats).map(([plat, data]) => ({
        platform: plat,
        ...data
      })).sort((a, b) => b.ltv_risk - a.ltv_risk),
      // Sort reviews by customer LTV descending for the detail panel
      reviews: stat.reviews.sort((a, b) => b.customer_ltv - a.customer_ltv).slice(0, 50) // limit to top 50 for performance
    };
  });

  // Calculate Response Gap Percentage
  const responseGapPct = highValueAngryCount > 0 
    ? Math.round((highValueIgnoredCount / highValueAngryCount) * 100) 
    : 0;

  const responseGapByPlatform = Object.entries(highValuePlatformStats).map(([platform, data]) => ({
    platform,
    complaints: data.complaints,
    responses: data.responses,
    responseRate: Math.round((data.responses / data.complaints) * 100),
    ownership: data.ownership
  })).sort((a, b) => b.complaints - a.complaints);

  // Process top co-occurrences
  const topCoOccurrences = Object.entries(coOccurrenceCounts)
    .map(([key, count]) => {
      const [issueA, issueB] = key.split('|');
      return {
        issueA,
        issueB,
        labelA: issueMap[issueA]?.name,
        labelB: issueMap[issueB]?.name,
        count
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Process Product Chart Data (Top 10)
  const productBreakdown = Object.entries(productRiskMap)
    .map(([product, ltv]) => ({ product, ltv }))
    .sort((a, b) => b.ltv - a.ltv)
    .slice(0, 10);

  // Process Platform Chart Data
  const platformBreakdown = Object.entries(platformRiskMap)
    .map(([platform, data]) => ({ platform, ltv: data.ltv, ownership: data.ownership }))
    .sort((a, b) => b.ltv - a.ltv);

  return {
    totalLTVAtRisk,
    urgentChurnLTV,
    responseGapPct,
    highValueIgnoredCount,
    responseGapByPlatform,
    issueStats,
    topCoOccurrences,
    productBreakdown,
    platformBreakdown
  };
}
