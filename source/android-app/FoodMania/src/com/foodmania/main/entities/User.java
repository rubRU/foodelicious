package com.foodmania.main.entities;

import com.foodmania.main.tools.HttpRequest;

public class User {
	
	public static User		gUser = new User();
	
	private String			mName;
	private String			mLastName;
	private String			mEmail;
	private EGender			mGender;
	private UserSettings	mSettings;
	
	public enum EGender {
		m, f;
	}
	
	public User() {
	}
	
	public User(String name, String lastName, String email, EGender gender) {
		this.mName = name;
		this.mLastName = lastName;
		this.mEmail = email;
		this.mGender = gender;
	}
	
	public boolean isConnected(String token, String email) {
		final HttpRequest httpRequest = new HttpRequest();
		boolean sucess = httpRequest.post(Server.R_PROFILE,
				"token", token,
				"email", email);
		
		return (sucess && httpRequest.mStatus != 201 ? false : true);
	}
	
	public String getName() {
		return this.mName;
	}
	
	public String getLastName() {
		return this.mLastName;
	}
	
	public String getEmail() {
		return this.mEmail;
	}
	
	public EGender  getGender() {
		return this.mGender;
	}
	
	public UserSettings getSettings() {
		return this.mSettings;
	}
}