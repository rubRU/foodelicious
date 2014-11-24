package com.foodmania.main;

import android.app.ListActivity;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;

public class FeedActivity extends ListActivity implements OnClickListener {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		String[][] values = new String[][] { {"Pomme", "food1"}, {"Poire",
		        "food2"}, {"Pêche", "food1"}, {"Bannane", "food1"}, {"Noix de coco", "food2"},
		        	{"Fraise", "food2"}, {"Kiwi", "food1"}};
	    FeedArrayAdapter adapter = new FeedArrayAdapter(this, values);
	    
	    setListAdapter(adapter);
	    this.getListView().setDivider(null);
	}
	
	@Override
	public void onClick(View v) {
	}

}
