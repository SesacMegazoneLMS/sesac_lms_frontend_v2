export const calculateStatistics = (courses) => {
    return {
      totalCourses: courses.length,
      totalStudents: courses.reduce((acc, course) => acc + (course.enrolledCount || 0), 0),
      totalRevenue: courses.reduce((acc, course) => {
        return acc + (course.price * (course.enrolledCount || 0));
      }, 0),
      monthlyRevenue: calculateMonthlyRevenue(courses),
      averageRating: calculateAverageRating(courses)
    };
  };
  
  const calculateMonthlyRevenue = (courses) => {
    const currentMonth = new Date().getMonth();
    return courses.reduce((acc, course) => {
      const monthlyEnrollments = course.enrollments?.filter(
        enrollment => new Date(enrollment.date).getMonth() === currentMonth
      ).length || 0;
      return acc + (course.price * monthlyEnrollments);
    }, 0);
  };
  
  const calculateAverageRating = (courses) => {
    const ratings = courses.map(course => course.rating).filter(Boolean);
    return ratings.length ? 
      (ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length).toFixed(1) : 
      0;
  };