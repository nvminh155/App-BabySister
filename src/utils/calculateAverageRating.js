function calculateAverageRating(reviews) {
  if (reviews.length === 0) {
    return 0; // Trả về 0 nếu không có đánh giá nào
  }
  // Tính tổng số sao
  const totalStars = reviews.reduce((sum, review) => sum + review.numsOfStars, 0);

  // Tính trung bình số sao
  const averageRating = totalStars / reviews.length;

  // Làm tròn số trung bình đến 1 chữ số thập phân
  return Math.round(averageRating * 10) / 10;
}

export default calculateAverageRating;
