package com.foodmania.main.entities;


public class User {
	
	private static User		gUser;
	
	private String			mId;
	private String			mName;
	private String			mLastName;
	private String			mEmail;
	private EGender			mGender;
	private UserSettings	mSettings;
	
	public enum EGender {
		m, f;
	}
	
	private User(String id, String name, String lastName, String email, EGender gender) {
		this.mId = id;
		this.mName = name;
		this.mLastName = lastName;
		this.mEmail = email;
		this.mGender = gender;
	}
	
	public static User newUser(String id, String name, String lastName, String email, EGender gender) {
		return gUser =  new User(id, name, lastName, email, gender);
	}
	
	public static boolean isConnected(String id, String token) {
		boolean sucess = HttpRequest.get(Server.R_PROFILE, id, token);
		
		return (sucess && HttpRequest.getStatus() == Server.SU_OK ? true : false);
	}
	
	public static User getInstance() {
		return gUser;
	}
	
	public static String getId() {
		return gUser.mId;
	}
	
	public static String getName() {
		return gUser.mName;
	}
	
	public static String getLastName() {
		return gUser.mLastName;
	}
	
	public static String getEmail() {
		return gUser.mEmail;
	}
	
	public static EGender  getGender() {
		return gUser.mGender;
	}
	
	public static UserSettings getSettings() {
		return gUser.mSettings;
	}
}