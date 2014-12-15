package com.foodmania.main.database;

import java.util.HashMap;
import java.util.Map;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

import com.foodmania.main.database.entities.Credentials;

public class CredentialsDataSource {

	private static final String 	TAG = "CredentialsDataSource";
	
	// Database fields
	private SQLiteDatabase 			mDatabase;
	private MySQLiteHelper 			mDbHelper;
	private static final String		TABLE_NAME = "Credentials";
	private Map<String, String>			mColumms = new HashMap<String, String>();
	  
	public CredentialsDataSource(Context context) {
		mDbHelper = new MySQLiteHelper(context);
		
		for (Map.Entry<String, String> columm : mDbHelper.tables.get(TABLE_NAME).entrySet()) {
			mColumms.put(columm.getKey(), columm.getKey());
	    }
	}
	
	public void open() throws SQLException {
		mDatabase = mDbHelper.getWritableDatabase();
	}
	
	public void close() {
		mDbHelper.close();
	}
	
	/**
	 * Create a Credential
	 * @param rawValues array of Strings. Should be like this : {Column name, value, ...}.
	 * @return the created Credential, or null.
	 */
	public Credentials createCredentials(String userId, String token) {
		Log.e(TAG, "Creating new credentials");
	    ContentValues values = new ContentValues();
	    
		values.put(mColumms.get("userId") , userId);
		values.put(mColumms.get("token") , token);
	    mDatabase.insert(TABLE_NAME, null, values);
	    
	    return getCredentials();
	}
	
	public Credentials getCredentials() {
		Log.e(TAG, "Getting credentials");
		Cursor cursor = mDatabase.query(TABLE_NAME, mColumms.keySet().toArray(new String[mColumms.size()]), null, null, null, null, null);
		Credentials newCredentials = cursorToCredentials(cursor);
		  
		cursor.close();
		  
		return newCredentials;
	  }
	  
	public void deleteCredentials(Credentials credentials) {
		Log.e(TAG, "Deleting credentials");
		String id = credentials.getId();
		
    	mDatabase.delete(TABLE_NAME, mColumms.get("_id") + " = " + id, null);
	}
	  
	private Credentials cursorToCredentials(Cursor cursor) {
	  	cursor.moveToFirst();
	  	if(cursor.getCount() > 0 
	  			&& cursor.getPosition() >= 0 
	  			&& !cursor.isNull(0) 
	  			&& !cursor.isNull(1)
	  			&& !cursor.isNull(2)) {
	  		Credentials credentials = new Credentials();
			  
	  		credentials.setUserId(cursor.getString(0));
	  		credentials.setToken(cursor.getString(1));
			  
	  		return credentials;
	  	} else {
	  		return null;
	  	}
  	}
}
