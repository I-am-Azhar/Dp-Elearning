export default function CourseCard({ course, onBuy }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
      {/* Badge */}
      {course.badge && (
        <div className="mb-2">
          <span className="text-xs font-medium text-gray-900">{course.badge}</span>
        </div>
      )}

      {/* Language/Type */}
      {course.language && course.type && (
        <div className="mb-3">
          <span className="text-xs text-gray-900">{course.language}</span>
          <span className="text-xs text-gray-400 mx-1">•</span>
          <span className="text-xs text-gray-500">{course.type}</span>
        </div>
      )}

      {/* Course Title */}
      <h2 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h2>

      {/* Course Subtitle */}
      {course.subtitle && (
        <p className="text-xs text-gray-600 mb-3">{course.subtitle}</p>
      )}

      {/* Features/Tags */}
      {course.features && course.features.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {course.features.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {feature}
            </span>
          ))}
          {course.features.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              +{course.features.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Pricing Section */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl font-bold text-gray-900">
            ₹{course.discountedPrice}
          </span>
          {course.originalPrice && course.originalPrice > course.discountedPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹{course.originalPrice}
            </span>
          )}
          {course.discount && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              {course.discount}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500">(+ GST)</p>
      </div>

      {/* Action Button */}
      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        onClick={() => onBuy(course._id)}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        <span>View Details</span>
      </button>
    </div>
  );
}