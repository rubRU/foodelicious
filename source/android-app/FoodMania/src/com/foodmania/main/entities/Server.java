package com.foodmania.main.entities;

public class Server {

	public static final String		ADRESS = "http://172.30.2.143";
	public static final int			PORT = 1337;
	
	public static final String		R_ROOT = ADRESS + ":" + PORT;
	public static final String		R_LOGIN = R_ROOT + "/login";
	public static final String		R_LOGOUT = R_ROOT + "/logout";
	public static final String		R_SIGNUP = R_ROOT + "/signup";;
	public static final String		R_PROFILE = R_ROOT + "/me";
	
	/* ERRORS */
	public static final int			ER_SERVER_NOT_RUNNING = 0;
	public static final int			ER_UNAUTHORIZED = 401;
	
	public static final int			ER_INVALID_EMAIL = 1;
	public static final int			ER_PASSWORD_TOO_SHORT = 2;
	
}
