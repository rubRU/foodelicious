package com.foodmania.main.database.entities;

public class Credentials {

	private String		mId;
	private String		mUserId;
	private String 		mToken;
 
	public Credentials(){
	}
 
	public Credentials(String userId, String token){
		this.mUserId = userId;
		mToken = token;
	}
 
	public String getId() {
		return mId;
	}
	
	public void setId(String id) {
		mId = id;
	}
	
	public String getUserId() {
		return mUserId;
	}
	
	public void setUserId(String userId) {
		mUserId = userId;
	}
	
	public String getToken() {
		return mToken;
	}
 
	public void setToken(String token) {
		mToken = token;
	}
}
