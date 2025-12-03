"use client"

import { useState } from "react"
import { Star, Send, Loader2, CheckCircle } from "lucide-react"
import axios from "axios"
import { toastError, toastSuccess } from "@/components/ui/ToastTypes"

interface ReviewFormProps {
    packageId: string
    userId: string
    userName: string
    userPhoto?: string | null
    bookingId?: string
    onReviewAdded: () => void
}

export function ReviewForm({ packageId, userId, userName, userPhoto, bookingId, onReviewAdded }: ReviewFormProps) {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [title, setTitle] = useState("")
    const [comment, setComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (rating === 0) {
            toastError("Please select a rating")
            return
        }

        if (!comment.trim()) {
            toastError("Please write a review")
            return
        }

        setIsSubmitting(true)

        try {
            const res = await axios.post("/api/reviews", {
                packageId,
                userId,
                userName,
                userPhoto,
                rating,
                title,
                comment,
                bookingId,
            })

            if (res.data.success) {
                toastSuccess("Review submitted successfully!")
                setRating(0)
                setTitle("")
                setComment("")
                onReviewAdded()
            } else {
                toastError(res.data.error || "Failed to submit review")
            }
        } catch (error: any) {
            console.error("Error submitting review:", error)
            toastError(error.response?.data?.error || "Failed to submit review")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

            {/* Star Rating */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Your Rating *</label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 transition-transform hover:scale-110"
                        >
                            <Star
                                className={`w-8 h-8 ${
                                    star <= (hoverRating || rating)
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300"
                                }`}
                            />
                        </button>
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground self-center">
                        {rating > 0 && (
                            <>
                                {rating === 1 && "Poor"}
                                {rating === 2 && "Fair"}
                                {rating === 3 && "Good"}
                                {rating === 4 && "Very Good"}
                                {rating === 5 && "Excellent"}
                            </>
                        )}
                    </span>
                </div>
            </div>

            {/* Review Title */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Review Title (Optional)</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Summarize your experience"
                    maxLength={100}
                    className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
            </div>

            {/* Review Comment */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Your Review *</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this package..."
                    rows={4}
                    maxLength={1000}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">{comment.length}/1000 characters</p>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                    </>
                ) : (
                    <>
                        <Send className="w-5 h-5" />
                        Submit Review
                    </>
                )}
            </button>
        </form>
    )
}

interface Review {
    id: string
    userId: string
    userName: string
    userPhoto: string | null
    rating: number
    title: string
    comment: string
    verified: boolean
    createdAt: string
}

interface ReviewListProps {
    reviews: Review[]
    isLoading?: boolean
}

export function ReviewList({ reviews, isLoading }: ReviewListProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 rounded-xl">
                <Star className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <h3 className="font-semibold text-lg mb-1">No Reviews Yet</h3>
                <p className="text-muted-foreground">Be the first to review this package!</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
            ))}
        </div>
    )
}

function ReviewCard({ review }: { review: Review }) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    return (
        <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-start gap-4">
                {/* User Avatar */}
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                    {review.userPhoto ? (
                        <img src={review.userPhoto} alt={review.userName} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-lg font-semibold text-slate-400">
                            {review.userName.charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>

                <div className="flex-1">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold">{review.userName}</span>
                        {review.verified && (
                            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                <CheckCircle className="w-3 h-3" />
                                Verified Traveler
                            </span>
                        )}
                    </div>

                    {/* Rating & Date */}
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                        star <= review.rating
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-300"
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                            {formatDate(review.createdAt)}
                        </span>
                    </div>

                    {/* Title */}
                    {review.title && (
                        <h4 className="font-medium mb-1">{review.title}</h4>
                    )}

                    {/* Comment */}
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        {review.comment}
                    </p>
                </div>
            </div>
        </div>
    )
}

interface ReviewSummaryProps {
    averageRating: number
    totalReviews: number
    ratingDistribution?: { [key: number]: number }
}

export function ReviewSummary({ averageRating, totalReviews, ratingDistribution }: ReviewSummaryProps) {
    return (
        <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center gap-6">
                {/* Average Rating */}
                <div className="text-center">
                    <div className="text-4xl font-bold text-foreground">{averageRating.toFixed(1)}</div>
                    <div className="flex justify-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-5 h-5 ${
                                    star <= Math.round(averageRating)
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300"
                                }`}
                            />
                        ))}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                        {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                    </div>
                </div>

                {/* Rating Distribution */}
                {ratingDistribution && (
                    <div className="flex-1 space-y-1.5">
                        {[5, 4, 3, 2, 1].map((rating) => {
                            const count = ratingDistribution[rating] || 0
                            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                            return (
                                <div key={rating} className="flex items-center gap-2">
                                    <span className="text-sm w-3">{rating}</span>
                                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-400 rounded-full transition-all"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-muted-foreground w-8">{count}</span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
