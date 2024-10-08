import React, { useState, useEffect } from 'react';

function ReviewList({ dataRestaurant, reviews, triggerReload }) {
  const [reviewList, setReviewList] = useState(reviews);

  const fetchData = async () => {
    try {
      const resModels = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/review/all/${dataRestaurant.refID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      const data = await resModels.json();
      setReviewList(data); // Update reviewList with newly fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dataRestaurant.refID, triggerReload]); // Re-fetch data when dataRestaurant.refID or triggerReload changes

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`text-xl md:text-2xl mx-1 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            &#9733;
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <span className="text-3xl font-bold mb-6 text-gray-900 flex items-center">
        <span className="material-symbols-outlined text-3xl m-[5px]">rate_review</span>
        <span className="ml-2">Reviews</span>
      </span>

      <div className="mt-4 space-y-6">
        <div className="max-h-[500px] overflow-y-auto">
          {reviewList.length > 0 ? (
            reviewList.map((review) => (
              <div key={review._id} className="m-[15px] p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div>
                  {/* Rating Section */}
                  <div className="flex items-center mb-2">
                    <span className="text-lg font-semibold text-gray-800 mr-2">Overall:</span>
                    {renderStars(review.rating)}
                  </div>

                  {/* Comment Section */}
                  <div className="flex flex-wrap items-start mt-2">
                    <div className="w-auto">
                      <p className="text-lg font-semibold text-gray-800">Detail:</p>
                    </div>
                    <div className="flex-1 md:ml-2 mt-1 md:mt-0">
                      <p className="text-base text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  </div>

                  {/* Images Section */}
                  <div className="border-t-[1px] border-gray-300 mt-4 pt-4">
                    {review.imagename && review.imagename.length > 0 && (
                      <div className="overflow-x-auto">
                        <div className="flex space-x-2">
                          {review.imagename.slice(0, 5).map((img, index) => (
                            <img
                              key={index}
                              src={`${process.env.NEXT_PUBLIC_BACKEND}/review/image/${img}`}
                              alt="Review"
                              className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg shadow-md"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewList;
