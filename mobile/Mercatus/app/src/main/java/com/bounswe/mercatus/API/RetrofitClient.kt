package com.bounswe.mercatus.API

import com.bounswe.mercatus.Models.*
import com.bounswe.mercatus.Models.Article.CreateArticleBody
import com.bounswe.mercatus.Models.Article.EditArticleBody
import com.bounswe.mercatus.Models.Article.GetArticleBody
import com.bounswe.mercatus.Models.Article.LikerModel
import com.bounswe.mercatus.Models.Comments.CommentBody
import com.bounswe.mercatus.Models.Comments.CommentEditBody
import com.bounswe.mercatus.Models.Comments.CommentShowTradingBody
import com.bounswe.mercatus.Models.Comments.LikerModelComment
import com.bounswe.mercatus.Models.TradingEquipments.ForexDataModel
import com.bounswe.mercatus.Models.TradingEquipments.OtherTradingBody
import com.bounswe.mercatus.Models.TradingEquipments.PriceModel
import com.bounswe.mercatus.Models.User.*
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


    // ---------------------    Trading Equipments SECTION  --------------------------

    // Get forex items
    @Headers("Content-Type:application/json")
    @GET("trading_equipments/forex")
    fun getForex(
        @Header("Authorization") token: String
    ): retrofit2.Call<List<ForexDataModel>>

    // Get forex items parity value
    @Headers("Content-Type:application/json")
    @GET("trading_equipments/{tr_eq_sym}/prices/daily")
    fun getForexParity(
        @Path("tr_eq_sym") tr_eq_sym: String,
        @Header("Authorization") token: String
    ): retrofit2.Call<List<PriceModel>>

    // Get forex items prices
    @Headers("Content-Type:application/json")
    @GET("trading_equipments/{tr_eq_sym}/prices/current")
    fun getForexPrices(
        @Path("tr_eq_sym") tr_eq_sym: String,
        @Header("Authorization") token: String
    ): retrofit2.Call<PriceModel>

    // Get digital items
    @Headers("Content-Type:application/json")
    @GET("trading_equipments/digital")
    fun getDigital(
        @Header("Authorization") token: String
    ): retrofit2.Call<List<ForexDataModel>>

    // Get other equipment items
    @Headers("Content-Type:application/json")
    @GET("trading_equipments")
    fun getOtherEquipments(
    ): retrofit2.Call<List<OtherTradingBody>>

    // Get comments for trading equipments
    @Headers("Content-Type:application/json")
    @GET("trading_equipments/{eqp_id}/comments")
    fun getEqpComments(
        @Path("eqp_id") fid: Int,
        @Header("Authorization") token: String
    ): retrofit2.Call<List<CommentShowTradingBody>>

    // Make trading equipment comment
    @Headers("Content-Type:application/json")
    @POST("trading_equipments/{eqp_id}/comments")
    fun makeEqpComment(
        @Body info: CreateCommentBody,
        @Path("eqp_id") mid: Int,
        @Header("Authorization") token: String
    ): retrofit2.Call<ResponseBody>

    // Delete trading equipment comment
    @Headers("Content-Type:application/json")
    @DELETE("comments/{comment_id}")
    fun deleteEqpComment(
        @Path("comment_id") mid: Int,
        @Header("Authorization") token: String
    ): retrofit2.Call<ResponseBody>

    // Edit trading equipment comment
    @Headers("Content-Type:application/json")
    @PUT("comments/{comment_id}")
    fun editEqpComment(
        @Body info: CommentEditBody,
        @Path("comment_id") mid: Int,
        @Header("Authorization") token: String
    ): retrofit2.Call<ResponseBody>

    // Make up prediction
    @Headers("Content-Type:application/json")
    @POST("trading_equipments/{eqp_id}/predictions/upvotes")
    fun makePredictionUp(
        @Path("eqp_id") mid: Int,
        @Header("Authorization") token: String
    ): retrofit2.Call<ResponseBody>

    // Make down prediction
    @Headers("Content-Type:application/json")
    @POST("trading_equipments/{eqp_id}/predictions/downvotes")
    fun makePredictionDown(
        @Path("eqp_id") mid: Int,
        @Header("Authorization") token: String
    ): retrofit2.Call<ResponseBody>

    // Get up prediction list for trading equipments
    @Headers("Content-Type:application/json")
    @GET("trading_equipments/{eqp_id}/predictions/upvotes")
    fun getUpVotes(
        @Path("eqp_id") fid: Int,
        @Header("Authorization") token: String
    ): retrofit2.Call<List<PredictionModel>>

    // Get down prediction list for trading equipments
    @Headers("Content-Type:application/json")
    @GET("trading_equipments/{eqp_id}/predictions/downvotes")
    fun getDownVotes(
        @Path("eqp_id") fid: Int,
        @Header("Authorization") token: String
    ): retrofit2.Call<List<PredictionModel>>

    // Get all events
    @Headers("Content-Type:application/json")
    @GET("events/{events_date}")
    fun getEvents(
        @Path("events_date") date: String,
        @Header("Authorization") token: String
    ): retrofit2.Call<List<GetEventBody>>

    // Create an event
    @Headers("Content-Type:application/json")
    @POST("events/{events_date}")
    fun createEvent(
        @Body info: CreateEventBody,
        @Header("Authorization") token: String
    ): retrofit2.Call<GetEventBody>


    // ---------------------    PORTFOLIO SECTION  --------------------------

    // Create an portfolio
    @Headers("Content-Type:application/json")
    @POST("users/{user_id}/portfolios")
    fun createPortfolio(
        @Body info: CreatePortfolioBody,
        @Path("user_id") id: Long,
        @Header("Authorization") token: String
    ): retrofit2.Call<GetPortfolioBody>


    // Get all portfolios
    @Headers("Content-Type:application/json")
    @GET("users/{user_id}/portfolios")
    fun getPortfolios(
        @Path("user_id") id: Long,
        @Header("Authorization") token: String
    ): retrofit2.Call<List<GetPortfolioBody>>

    // Get Specific Portfolio
    @Headers("Content-Type:application/json")
    @GET("users/{user_id}/portfolios/{portfolio_id}")
    fun getSpecificPortfolio(
        @Path("user_id") mid: Long,
        @Header("Authorization") token: String,
        @Path("portfolio_id") id: Long
    ): retrofit2.Call<GetSpecificPortfolio>

    // Get Specific Portfolio
    @Headers("Content-Type:application/json")
    @PUT("users/{user_id}/portfolios/{portfolio_id}")
    fun updatePortfolio(
        @Body info: UpdatePortfolio,
        @Path("user_id") mid: Long,
        @Header("Authorization") token: String,
        @Path("portfolio_id") id: Long
    ): retrofit2.Call<GetPortfolioBody>

    // Delete Portfolio
    @Headers("Content-Type:application/json")
    @DELETE("users/{user_id}/portfolios/{portfolio_id}")
    fun deletePortfolio(
        @Path("user_id") mid: Long,
        @Header("Authorization") token: String,
        @Path("portfolio_id") id: Long
    ): retrofit2.Call<ResponseBody>

    // ---------------------    ASSET SECTION  --------------------------



    // Get all portfolios
    @Headers("Content-Type:application/json")
    @GET("users/{user_id}/assets")
    fun getAssets(
        @Path("user_id") id: Long,
        @Header("Authorization") token: String
    ): retrofit2.Call<List<GetAssetsBody>>

    // Get all portfolios
    @Headers("Content-Type:application/json")
    @POST("users/{user_id}/cash")
    fun addCash(

        @Body info: AddCashBody,
        @Path("user_id") id: Long,
        @Header("Authorization") token: String
    ): retrofit2.Call<List<GetAssetsBody>>


    // Get all portfolios
    @Headers("Content-Type:application/json")
    @POST("users/{user_id}/assets")
    fun buyAssets(
        @Body info: BuyAssetsModel,
        @Path("user_id") id: Long,
        @Header("Authorization") token: String
    ): retrofit2.Call<GetAssetsBody>

    // ---------------------    NOTIFICATION SECTION  --------------------------
    // Get all notifications count
    @Headers("Content-Type:application/json")
    @GET("users/{user_pk}/notifications/count")
    fun getNotificationAmout(
        @Path("user_pk") user_pk: Long,
        @Header("Authorization") token: String
    ): retrofit2.Call<NotifyResultBody>

    // Get all notifications list
    @Headers("Content-Type:application/json")
    @GET("users/{user_pk}/notifications")
    fun getNotifications(
        @Path("user_pk") user_pk: Long,
        @Header("Authorization") token: String
    ): retrofit2.Call<List<NotificationsBody>>

    // ---------------------    RECOMMENDED SECTION  --------------------------
    // Get all notifications count
    @Headers("Content-Type:application/json")
    @GET("articles/recommendations")
    fun getRecommends(
        @Header("Authorization") token: String
    ): retrofit2.Call<List<GetArticleBody>>
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