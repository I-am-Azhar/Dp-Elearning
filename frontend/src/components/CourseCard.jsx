export default function CourseCard({ course, onBuy }) {
  return (
    <div className="border rounded p-4 flex justify-between items-center shadow bg-white">
      <div>
        <h2 className="text-xl font-semibold">{course.title}</h2>
        <p className="text-gray-600">₹{course.price}/-</p>
      </div>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        onClick={() => onBuy(course._id)}
      >
        Buy
      </button>
    </div>
  );
}