package com.reigninblood.idualremote;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

/** Replace generated MainActivity.java, or add registerPlugin(...) before super.onCreate. */
public class MainActivity extends BridgeActivity {
  @Override public void onCreate(Bundle savedInstanceState) {
    registerPlugin(ConsumerIrPlugin.class);
    super.onCreate(savedInstanceState);
  }
}
