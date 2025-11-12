class RouteOptimizer {
  constructor(bins) {
    this.bins = bins;
    this.depot = [18.5204, 73.8567]; // Starting point
  }

  // Simple nearest neighbor algorithm for route optimization
  optimizeRoute(targetBins = null) {
    const binsToCollect = targetBins || this.bins.filter(bin => bin.level >= 60);
    if (binsToCollect.length === 0) return [];

    const route = [];
    let currentLocation = this.depot;
    const remaining = [...binsToCollect];

    while (remaining.length > 0) {
      let nearestIndex = 0;
      let minDistance = this.calculateDistance(currentLocation, remaining[0].location);

      for (let i = 1; i < remaining.length; i++) {
        const distance = this.calculateDistance(currentLocation, remaining[i].location);
        if (distance < minDistance) {
          minDistance = distance;
          nearestIndex = i;
        }
      }

      const nextBin = remaining.splice(nearestIndex, 1)[0];
      route.push({
        ...nextBin,
        distance: minDistance,
        estimatedTime: this.estimateCollectionTime(nextBin)
      });
      currentLocation = nextBin.location;
    }

    return route;
  }

  calculateDistance(point1, point2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(point2[0] - point1[0]);
    const dLon = this.toRad(point2[1] - point1[1]);
    const lat1 = this.toRad(point1[0]);
    const lat2 = this.toRad(point2[0]);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  toRad(value) {
    return value * Math.PI / 180;
  }

  estimateCollectionTime(bin) {
    const baseTime = 5; // 5 minutes base collection time
    const levelMultiplier = bin.level / 100;
    return Math.round(baseTime * (1 + levelMultiplier));
  }

  getTotalRouteStats(route) {
    const totalDistance = route.reduce((sum, bin) => sum + bin.distance, 0);
    const totalTime = route.reduce((sum, bin) => sum + bin.estimatedTime, 0);
    const fuelCost = totalDistance * 0.5; // Assuming 0.5 units per km

    return {
      totalDistance: totalDistance.toFixed(2),
      totalTime,
      estimatedFuelCost: fuelCost.toFixed(2),
      binsCount: route.length
    };
  }
}

// Make RouteOptimizer globally available
window.RouteOptimizer = RouteOptimizer;

// For module compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RouteOptimizer;
}