import coursesData from '../mock/db/courses.json';
import roadmapsData from '../mock/db/roadmaps.json';

export const getCourses = () => {
  return Promise.resolve(coursesData.courses);
};

export const getRoadmaps = () => {
  return Promise.resolve(roadmapsData.roadmaps);
};

export const getCourseById = (id) => {
  const course = coursesData.courses.find(course => course.id === id);
  return Promise.resolve(course);
};

export const getRoadmapById = (id) => {
  const roadmap = roadmapsData.roadmaps.find(roadmap => roadmap.id === id);
  return Promise.resolve(roadmap);
};