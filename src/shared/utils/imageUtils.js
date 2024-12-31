// 모든 강의 이미지 import
import BigDataAnalysis from '../../assets/images/courses/BigDataAnalysis.png';
import career from '../../assets/images/courses/career.png';
import Clang from '../../assets/images/courses/Clang.png';
import fullstack from '../../assets/images/courses/fullstack.png';
import GameDesigner from '../../assets/images/courses/GameDesigner.png';
import GameProgrammer from '../../assets/images/courses/GameProgrammer.png';
import JavaStart from '../../assets/images/courses/JavaStart.png';
import Kind from '../../assets/images/courses/Kind.png';
import Kubernetes from '../../assets/images/courses/Kubernetes.png';
import MidjourneyTechniques from '../../assets/images/courses/MidjourneyTechniques.png';
import MlAIEngineer from '../../assets/images/courses/MlAIEngineer.png';
import Python60mins from '../../assets/images/courses/Python60mins.png';
import Python2024 from '../../assets/images/courses/Python2024.png';
import SpringBoot from '../../assets/images/courses/SpringBoot.png';

const imageMap = {
    "BigDataAnalysis": BigDataAnalysis,
    "career": career,
    "Clang": Clang,
    "fullstack": fullstack,
    "GameDesigner": GameDesigner,
    "GameProgrammer": GameProgrammer,
    "JavaStart": JavaStart,
    "Kind": Kind,
    "Kubernetes": Kubernetes,
    "MidjourneyTechniques": MidjourneyTechniques,
    "MlAIEngineer": MlAIEngineer,
    "Python60mins": Python60mins,
    "Python2024": Python2024,
    "SpringBoot": SpringBoot,
};

const defaultImages = Object.values(imageMap).map(image => image);

export function getCourseImage(course) {
    if (!course) return null;
    return imageMap[course.title] || defaultImages[course.id % defaultImages.length] || defaultImages[course.courseId % defaultImages.length];
}