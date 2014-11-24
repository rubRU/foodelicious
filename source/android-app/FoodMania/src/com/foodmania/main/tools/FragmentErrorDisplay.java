package com.foodmania.main.tools;

import android.app.Activity;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.foodmania.R;

public class FragmentErrorDisplay extends Fragment {

	private FragmentActivity 	mActivity;

	private LinearLayout		mErrorWrapper;
	private TextView			mError;
	
	private int					mErrId;
	
	@Override
	public void onAttach (Activity activity) {
		super.onAttach(activity);
		this.mActivity = (FragmentActivity) activity;
	}
	
	public FragmentErrorDisplay(int errID) {
		mErrId = errID;
	}

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
		View rootView = inflater.inflate(R.layout.fragment_error_display, container, false);

		mErrorWrapper = (LinearLayout) rootView.findViewById(R.id.errorWrapper);
		mError = (TextView) rootView.findViewById(R.id.error);
		
		mErrorWrapper.setVisibility(View.VISIBLE);
        mError.setText(mErrId);
        
		return rootView;
	}
}
