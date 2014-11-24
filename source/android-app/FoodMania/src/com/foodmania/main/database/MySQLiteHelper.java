package com.foodmania.main.database;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

public class MySQLiteHelper extends SQLiteOpenHelper {
	
	public Map<String, Map<String, String>> 	tables = new HashMap<String, Map<String, String>>();

	private static final String 				DATABASE_NAME = "sona.db";
	private static final int 					DATABASE_VERSION = 1;

	public MySQLiteHelper(Context context) {
		super(context, DATABASE_NAME, null, DATABASE_VERSION);
		Map<String, String> credentials = new HashMap<String, String>();
		
		credentials.put("_id", "INTEGER PRIMARY KEY AUTOINCREMENT");
		credentials.put("token", "TEXT");
		credentials.put("email", "TEXT");
		tables.put("Credentials", credentials);
	}

	@Override
	public void onCreate(SQLiteDatabase database) {
		Iterator<Entry<String, Map<String, String>>> tablesIterator = tables.entrySet().iterator();
		String dbCreateQuery = "create ";
		
		while (tablesIterator.hasNext()) {
			Entry<String, Map<String, String>> tablesEntry = (Entry<String, Map<String, String>>)tablesIterator.next();
			Iterator<Entry<String, String>> colummsIterator = tablesEntry.getValue().entrySet().iterator();
			dbCreateQuery += "table " + tablesEntry.getKey().toString() + " ( ";

			while (colummsIterator.hasNext()) {
				Entry<String, String> colummsEntry = (Entry<String, String>)colummsIterator.next();
				Log.e("DB", colummsEntry.getKey() + " " + colummsEntry.getValue());
				dbCreateQuery += colummsEntry.getKey() + " " + colummsEntry.getValue();
				dbCreateQuery += colummsIterator.hasNext() ? ", " : ")";
			}
			dbCreateQuery += tablesIterator.hasNext() ? ", " : ";";
		}
		Log.e("DB", dbCreateQuery);
		database.execSQL(dbCreateQuery);
	}
	
	@Override
	public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
		Log.e(MySQLiteHelper.class.getName(), "Upgrading database from version "
				+ oldVersion
				+ " to "
				+ newVersion
				+ ", which will destroy all old data");
		for (Map.Entry<String, Map<String, String>> entry : tables.entrySet()) {
			db.execSQL("DROP TABLE IF EXISTS " + entry.getKey());
		}
	    onCreate(db);
	}
}
