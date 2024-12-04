import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiLock, FiPlay } from 'react-icons/fi';

function CurriculumSection({ curriculum }) {
  const [openSections, setOpenSections] = useState(new Set([1]));

  const toggleSection = (sectionId) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(sectionId)) {
      newOpenSections.delete(sectionId);
    } else {
      newOpenSections.add(sectionId);
    }
    setOpenSections(newOpenSections);
  };

  const getTotalDuration = (lectures) => {
    return lectures.reduce((total, lecture) => {
      const [min, sec] = lecture.duration.split(':').map(Number);
      return total + min * 60 + sec;
    }, 0);
  };

  const formatTotalDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}시간 ${minutes}분`;
  };

  return (
    <div className="space-y-4">
      {curriculum.map((section) => (
        <div key={section.sectionId} className="border rounded-lg">
          <button
            onClick={() => toggleSection(section.sectionId)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div className="flex items-center space-x-2">
              {openSections.has(section.sectionId) ? (
                <FiChevronUp className="text-gray-500" />
              ) : (
                <FiChevronDown className="text-gray-500" />
              )}
              <h3 className="font-medium">{section.title}</h3>
              <span className="text-sm text-gray-500">
                {section.lectures.length}강 • {formatTotalDuration(getTotalDuration(section.lectures))}
              </span>
            </div>
          </button>

          {openSections.has(section.sectionId) && (
            <div className="border-t">
              {section.lectures.map((lecture) => (
                <div
                  key={lecture.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <FiPlay className="text-gray-400" />
                    <span className="text-sm">{lecture.title}</span>
                    {lecture.isFree && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">
                        무료 강의
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">{lecture.duration}</span>
                    {!lecture.isFree && <FiLock className="text-gray-400" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default CurriculumSection;