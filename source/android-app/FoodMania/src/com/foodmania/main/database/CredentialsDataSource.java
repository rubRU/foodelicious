package com.foodmania.main.database;

import java.util.ArrayList;
import java.util.Map;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

import com.foodmania.main.database.entities.Credentials;

public class CredentialsDataSource {

	 // Database fields
	  private SQLiteDatabase 		mDatabase;
	  private MySQLiteHelper 		mDbHelper;
	  /*private String[] allColumns = { MySQLiteHelper.COLUMN_ID,
	      MySQLiteHelper.COLUMN_COMMENT 11};*/
	  private static final String	TABLE_NAME = "Credentials";
	  private ArrayList<String>		mColumms = new ArrayList<>();
	  
	  public CredentialsDataSource(Context context) {
		  mDbHelper = new MySQLiteHelper(context);
	    for (Map.Entry<String, String> columm : mDbHelper.tables.get(TABLE_NAME).entrySet()) {
	    	mColumms.add(columm.getKey());
	    }
	  }

	  public void open() throws SQLException {
		  mDatabase = mDbHelper.getWritableDatabase();
	  }

	  public void close() {
		  mDbHelper.close();
	  }

	  public Credentials createCredentials(String... rawValues) {
		Log.e("CREATING", "CREATING");
	    ContentValues values = new ContentValues();
	    
	    for (int i = 0; i < rawValues.length; i++) {
	    	values.put(mColumms.get(i + 1) , rawValues[i]);
	    }

	    mDatabase.insert(TABLE_NAME, null, values);
	    
	    return getCredentials();
	  }

	  public Credentials getCredentials() {
		  Log.e("GETTING", "GETTING");
		  Cursor cursor = mDatabase.query(TABLE_NAME, mColumms.toArray(new String[mColumms.size()]), null, null, null, null, null);
		  Credentials newCredentials = cursorToCredentials(cursor);
		  
		  cursor.close();
		  
		  return newCredentials;
	  }
	  
	  public void deleteCredentials(Credentials credentials) {
		    String id = credentials.getId();
		    mDatabase.delete(TABLE_NAME, mColumms.get(0) + " = " + id, null);
		  }
	  
	  private Credentials cursorToCredentials(Cursor cursor) {
		  cursor.moveToFirst();
		  if(cursor.getCount() > 0 
				  && cursor.getPosition() >= 0 
				  && !cursor.isNull(0) 
				  && !cursor.isNull(1)
				  && !cursor.isNull(2)) {
			  Credentials credentials = new Credentials();
			  
			  credentials.setId(cursor.getString(0));
			  credentials.setToken(cursor.getString(1));
			  credentials.setEmail(cursor.getString(2));
			  
			  return credentials;
		  } else {
			  return null;
		  }
	  }
}
