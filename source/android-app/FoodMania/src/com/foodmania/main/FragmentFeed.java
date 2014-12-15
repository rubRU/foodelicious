package com.foodmania.main;

import android.app.Activity;
import android.app.Fragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.ListView;

import com.foodmania.R;

public class FragmentFeed extends Fragment implements OnClickListener {

	private Activity 		mActivity;
	
	private ListView		mListView;
	
	@Override
	public void onAttach (Activity activity) {
		super.onAttach(activity);
		this.mActivity = activity;
	}
	
	public static FragmentFeed newInstance() {
		FragmentFeed fragment = new FragmentFeed();
		
		return fragment;
	}

	public FragmentFeed() {
	}

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
		View rootView = inflater.inflate(R.layout.fragment_feed, container, false);
		
		mListView = (ListView) rootView.findViewById(R.id.listview);
		
		String[][] values = new String[][] { {"Pomme", "food1"}, {"Poire",
        "food2"}, {"Pêche", "food1"}, {"Bannane", "food1"}, {"Noix de coco", "food2"},
        	{"Fraise", "food2"}, {"Kiwi", "food1"}};
		FeedArrayAdapter adapter = new FeedArrayAdapter(mActivity, values);
		
		mListView.setAdapter(adapter);
		
		return rootView;
	}
	
	@Override
	public void onClick(View v) {
	}
}
