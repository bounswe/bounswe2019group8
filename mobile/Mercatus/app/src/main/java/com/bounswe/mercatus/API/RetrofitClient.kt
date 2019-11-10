package com.bounswe.mercatus.API

import com.bounswe.mercatus.Models.SignInBody
import com.bounswe.mercatus.Models.SignInRes
import com.bounswe.mercatus.Models.UserBody
import com.bounswe.mercatus.Models.UserRes
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
    fun signin(@Body info: SignInBody): retrofit2.Call<SignInRes>

    // Sign up request
    @Headers("Content-Type:application/json")
    @POST("users")
    fun registerUser(
        @Body info: UserBody
    ): retrofit2.Call<ResponseBody>

    // Get user request
    @Headers("Content-Type: application/json")
    @GET("users/{user_id}")
    fun getUser(
        @Path("user_id") id: Long,
        @Header("Authorization") token: String
    ): retrofit2.Call<ResponseBody>

    // Update user request
    @Headers("Content-Type: application/json")
    @PUT("users/{user_id}")
    fun updateUser(
        @Body userBody: MutableMap<String, String>,
        @Path("user_id") id: Long,
        @Header("Authorization") token: String
    ): retrofit2.Call<ResponseBody>

    // Get users request
    @Headers("Content-Type: application/json")
    @GET("users")
    fun getUsers(
        @Header("Authorization") token: String
    ): retrofit2.Call<List<UserRes>>
}
class RetrofitInstance {
    companion object {
        val BASE_URL: String = "http://8.209.81.242:8000/"


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