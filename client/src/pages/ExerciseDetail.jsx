
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const ExerciseDetail = () => {
  const { id } = useParams();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
const navigate = useNavigate();
  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/exercises/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setExercise(data);
        } else {
          const err = await res.json();
          setError(err.message || 'حرکت یافت نشد.');
        }
      } catch (err) {
        setError('اتصال به سرور برقرار نیست.');
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>در حال بارگذاری جزئیات حرکت...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md p-6 text-center text-red-700 bg-red-100 rounded-lg">
          <p>{error}</p>
          <Link to="/exercises" className="inline-block mt-4 text-blue-600 hover:underline">
            بازگشت به کتابخانه
          </Link>
        </div>
      </div>
    );
  }

const handleDelete = async () => {
  if (!window.confirm('آیا از حذف این حرکت سفارشی اطمینان دارید؟ این عمل قابل بازگشت نیست.')) {
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/exercises/custom/${exercise._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (res.ok) {
      alert('حرکت با موفقیت حذف شد.');
      navigate('/exercises'); // بازگشت به کتابخانه
    } else {
      const data = await res.json();
      alert(data.message || 'حذف انجام نشد.');
    }
  } catch (err) {
    alert('اتصال به سرور برقرار نیست.');
  }
};
  
  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
<div className="flex items-center mb-6">
  <Link
    to="/exercises"
    className="text-sm text-blue-600 hover:underline"
  >
    ← بازگشت به کتابخانه
  </Link>

  {exercise.isCustom && (
    <>
      <Link
        to={`/exercises/${exercise._id}/edit`}
        className="px-4 py-2 mr-4 text-sm text-white bg-yellow-500 rounded-lg hover:bg-yellow-600"
      >
        ✏️ ویرایش
      </Link>
      <button
        onClick={handleDelete}
        className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600"
      >
        🗑️ حذف
      </button>
    </>
  )}
</div> 
   {/* کارت اصلی */}
        <div className="overflow-hidden bg-white shadow-lg rounded-xl">
          {/* تصویر */}
          <div className="w-full h-64 overflow-hidden sm:h-80">
            <img
              src={exercise.image}
              alt={exercise.name}
              className="object-cover w-full h-full"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x400?text=Exercise+Image';
              }}
            />
          </div>

          {/* محتوا */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-800">{exercise.name}</h1>
              {exercise.isCustom && (
                <span className="px-3 py-1 text-sm text-purple-700 bg-purple-100 rounded-full">
                  سفارشی
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 mb-6 text-sm md:grid-cols-3">
              <div className="p-3 rounded-lg bg-blue-50">
                <span className="font-medium text-gray-700">عضله هدف:</span>
                <p className="text-blue-700">{exercise.muscle}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <span className="font-medium text-gray-700">وسیله:</span>
                <p className="text-green-700">{exercise.equipment}</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">
                <span className="font-medium text-gray-700">نوع:</span>
                <p className="text-gray-700">{exercise.isCustom ? 'سفارشی' : 'استاندارد'}</p>
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-semibold text-gray-800">توضیحات اجرا</h2>
              <p className="leading-relaxed text-gray-700 whitespace-pre-line">
                {exercise.instructions || 'توضیحاتی وارد نشده است.'}
              </p>
            </div>
          </div>
        </div>

        {/* دکمه اضافه به تمرین (در آینده) */}
        <div className="mt-6 text-center">
          <button
            // onClick={() => addExerciseToWorkout(exercise)}
            className="font-medium text-green-600 hover:text-green-800"
          >
            + اضافه کردن به تمرین جدید
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;