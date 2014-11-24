package com.foodmania.main.database.entities;

public class Credentials {

	private String		mId;
	private String 		mToken;
	private String 		mEmail;
 
	public Credentials(){
	}
 
	public Credentials(String token, String email){
		mToken = token;
		mEmail = email;
	}
 
	public String getId() {
		return mId;
	}
	
	public void setId(String id) {
		mId = id;
	}
	
	public String getToken() {
		return mToken;
	}
 
	public void setToken(String token) {
		mToken = token;
	}
	
	public String getEmail() {
		return mEmail;
	}
 
	public void setEmail(String email) {
		mEmail = email;
	}
}
