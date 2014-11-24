package com.foodmania.main;

import java.lang.reflect.Field;

import android.app.Activity;
import android.graphics.drawable.Drawable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.foodmania.R;

public class FeedArrayAdapter extends ArrayAdapter<String[]> {

	private final Activity 		mContext;
	private final String[][] 	mPosts;

	  static class ViewHolder {
	    public TextView text;
	    public ImageView image;
	  }

  public FeedArrayAdapter(Activity context, String[][] posts) {
    super(context, R.layout.fragment_error_display, posts);
    this.mContext = context;
    this.mPosts = posts;
  }

  @Override
  public View getView(int position, View convertView, ViewGroup parent) {
    View rowView = convertView;
    
    if (rowView == null) {
      LayoutInflater inflater = mContext.getLayoutInflater();
      rowView = inflater.inflate(R.layout.feed_item_recipe_post, null);
      ViewHolder viewHolder = new ViewHolder();
      
      viewHolder.text = (TextView) rowView.findViewById(R.id.title);
      viewHolder.image = (ImageView) rowView.findViewById(R.id.picture);
      rowView.setTag(viewHolder);
    }

    ViewHolder holder = (ViewHolder) rowView.getTag();
    
    holder.text.setText(mPosts[position][0]);
    holder.image.setImageResource(getResId(mPosts[position][1], R.drawable.class));

    return rowView;
  }
  
  public static int getResId(String variableName, Class<?> c) {
	    try {
	        Field idField = c.getDeclaredField(variableName);
	        return idField.getInt(idField);
	    } catch (Exception e) {
	        e.printStackTrace();
	        return -1;
	    } 
	}
}
