package com.bounswe.mercatus.API

import com.bounswe.mercatus.Models.*
import okhttp3.OkHttpClient
import okhttp3.ResponseBody
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*

interface ApiInterface {

    // Sign in request
    @Headers("Content-Type:application/json")
    @POST("auth_tokens")
    fun signin(
        @Body info: SignInBody
    ): retrofit2.Call<SignInRes>

    // Sign up request
    @Headers("Content-Type:application/json")
    @POST("users")
    fun registerUser(
        @Body info: UserBody
    ): retrofit2.Call<UserRes>

    // Get user request
    @Headers("Content-Type: application/json")
    @GET("users/{user_id}")
    fun getUser(
        @Path("user_id") id: Long,
        @Header("Authorization") token: String
    ): retrofit2.Call<UserRes>

    // Update user request
    @Headers("Content-Type: application/json")
    @PUT("users/{user_id}")
    fun updateUser(
        @Body userBody: UpdateUserBody,
        @Path("user_id") id: Long,
        @Header("Authorization") token: String
    ): retrofit2.Call<ResponseBody>

    // Update user request
    @Headers("Content-Type: application/json")
    @PUT("users/{user_id}")
    fun updatePassword(
        @Body userBody: UpdatePassword,
        @Path("user_id") id: Long,
        @Header("Authorization") token: String
    ): retrofit2.Call<ResponseBody>

    // Get users request
    @Headers("Content-Type: application/json")
    @GET("users")
    fun getUsers(
        @Header("Authorization") token: String
    ): retrofit2.Call<List<UserRes>>

    // Search user request
    @Headers("Content-Type:application/json")
    @POST("user_searches")
    fun searchUser(
        @Body info: SearchBody,
        @Header("Authorization") token: String
    ): retrofit2.Call<List<SearchRes>>

    // Follow user
    @Headers("Content-Type:application/json")
    @POST("users/{user_id}/followings")
    fun followUser(
        @Body info: FollowBody,
        @Path("user_id") id: Long,
        @Header("Authorization") token: String
    ): retrofit2.Call<UserRes>

    // UnFollow user
    @Headers("Content-Type:application/json")
    @DELETE("users/{my_id}/followings/{user_id}")
    fun unFollowUser(
        @Path("my_id") mid: Long,
        @Header("Authorization") token: String,
        @Path("user_id") id: Long
    ): retrofit2.Call<ResponseBody>

    // Get all articles
    @Headers("Content-Type:application/json")
    @GET("articles")
    fun getArticles(
        @Header("Authorization") token: String
    ): retrofit2.Call<List<GetArticleBody>>

    // Get an article
    @Headers("Content-Type:application/json")
    @GET("articles/{article_id}")
    fun getOneArticle(
        @Path("article_id") mid: Int,
        @Header("Authorization") token: String
    ): retrofit2.Call<GetArticleBody>

    // Like an article
    @Headers("Content-Type:application/json")
    @POST("articles/{article_id}/likes")
    fun likeArticle(
        @Path("article_id") mid: Int,
        @Header("Authorization") token: String
    ): retrofit2.Call<ResponseBody>

    // Delete Like an article
    @Headers("Content-Type:application/json")
    @DELETE("articles/{article_id}/likes")
    fun deleteLikeArticle(
        @Path("article_id") mid: Int,
        @Header("Authorization") token: String
    ): retrofit2.Call<ResponseBody>

    // Get like for article
    @Headers("Content-Type:application/json")
    @GET("articles/{article_id}/likes")
    fun getLikes(
        @Path("article_id") mid: Int,
        @Header("Authorization") token: String
    ): retrofit2.Call<List<LikerModel>>

    // Get dislike for article
    @Headers("Content-Type:application/json")
    @GET("articles/{article_id}/dislikes")
    fun getDislikes(
        @Path("article_id") mid: Int,
        @Header("Authorization") token: String
    ): retrofit2.Call<List<LikerModel>>

    // Dislike an article
    @Headers("Content-Type:application/json")
    @POST("articles/{article_id}/dislikes")
    fun disLikeArticle(
        @Path("article_id") mid: Int,
        @Header("Authorization") token: String
    ): retrofit2.Call<ResponseBody>

    // Delete DisLike an article
    @Headers("Content-Type:application/json")
    @DELETE("articles/{article_id}/dislikes")
    fun deleteDislikeArticle(
        @Path("article_id") mid: Int,
        @Header("Authorization") token: String
    ): retrofit2.Call<ResponseBody>

    // Create an article
    @Headers("Content-Type:application/json")
    @POST("articles")
    fun createArticle(
        @Body info: CreateArticleBody,
        @Header("Authorization") token: String
    ): retrofit2.Call<GetArticleBody>

    // Delete an article
    @Headers("Content-Type:application/json")
    @DELETE("articles/{article_id}")
    fun deleteArticle(
        @Path("article_id") mid: Int,
        @Header("Authorization") token: String
    ): retrofit2.Call<ResponseBody>

    // Edit an article
    @Headers("Content-Type:application/json")
    @PUT("articles/{article_id}")
    fun editArticle(
        @Body info: EditArticleBody,
        @Path("article_id") mid: Int,
        @Header("Authorization") token: String
    ): retrofit2.Call<ResponseBody>

    // Get all comments
    @Headers("Content-Type:application/json")
    @GET("articles/{article_id}/comments")
    fun getComments(
        @Path("article_id") mid: Int,
        @Header("Authorization") token: String
    ): retrofit2.Call<List<CommentBody>>

    // Make a comment
    @Headers("Content-Type:application/json")
    @POST("articles/{article_id}/comments")
    fun makeComment(
        @Body info: CreateCommentBody,
        @Path("article_id") mid: Int,
        @Header("Authorization") token: String
    ): retrofit2.Call<ResponseBody>

    // Delete a comment
    @Headers("Content-Type:application/json")
    @DELETE("comments/{comment_id}")
    fun deleteComment(
        @Path("comment_id") mid: Int,
        @Header("Authorization") token: String
    ): retrofit2.Call<ResponseBody>

    // Edit a comment
    @Headers("Content-Type:application/json")
    @PUT("comments/{comment_id}")
    fun editComment(
        @Body info: CommentEditBody,
        @Path("comment_id") mid: Int,
        @Header("Authorization") token: String
    ): retrofit2.Call<ResponseBody>

    // Like a comment
    @Headers("Content-Type:application/json")
    @POST("comments/{comment_id}/likes")
    fun likeComment(
        @Path("comment_id") cid: Int,
        @Header("Authorization") token: String
    ): retrofit2.Call<ResponseBody>

    // Get like for comments
    @Headers("Content-Type:application/json")
    @GET("comments/{comment_id}/likes")
    fun getLikesComments(
        @Path("comment_id") mid: Int,
        @Header("Authorization") token: String
    ): retrofit2.Call<List<LikerModelComment>>

    // Delete Like a comment
    @Headers("Content-Type:application/json")
    @DELETE("comments/{comment_id}/likes")
    fun deleteLikeComment(
        @Path("comment_id") mid: Int,
        @Header("Authorization") token: String
    ): retrofit2.Call<ResponseBody>

    // Dislike a comment
    @Headers("Content-Type:application/json")
    @POST("comments/{comment_id}/dislikes")
    fun dislikeComment(
        @Path("comment_id") cid: Int,
        @Header("Authorization") token: String
    ): retrofit2.Call<ResponseBody>

    // Get dislike for comments
    @Headers("Content-Type:application/json")
    @GET("comments/{comment_id}/dislikes")
    fun getDislikeComments(
        @Path("comment_id") mid: Int,
        @Header("Authorization") token: String
    ): retrofit2.Call<List<LikerModelComment>>

    // Delete Dislike a comment
    @Headers("Content-Type:application/json")
    @DELETE("comments/{comment_id}/dislikes")
    fun deleteDislikeComment(
        @Path("comment_id") mid: Int,
        @Header("Authorization") token: String
    ): retrofit2.Call<ResponseBody>
}
class RetrofitInstance {
    companion object {
        private val BASE_URL: String = "http://8.209.81.242:8000/"


        val interceptor: HttpLoggingInterceptor = HttpLoggingInterceptor().apply {
            this.level = HttpLoggingInterceptor.Level.BODY
        }

        val client: OkHttpClient = OkHttpClient.Builder().apply {
            this.addInterceptor(interceptor)
        }.build()
        /**
         * Companion object to create the Mercatus
         */
        fun getRetrofitInstance(): Retrofit {
            return Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
        }
    }
}