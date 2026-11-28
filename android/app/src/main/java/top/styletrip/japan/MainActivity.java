package top.styletrip.japan;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.ContentValues;
import android.provider.MediaStore;
import java.io.InputStream;
import java.io.OutputStream;
import android.content.Intent;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.NetworkCapabilities;
import android.net.Uri;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.WindowInsets;
import android.webkit.CookieManager;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import androidx.webkit.WebViewAssetLoader;
import java.io.IOException;

public class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final String BASE = "https://" + HOST + "/assets/";
    private WebView web;
    private TextView connection;
    private ValueCallback<Uri[]> fileCallback;
    private ConnectivityManager.NetworkCallback networkCallback;
    private boolean previousOnline;
    private boolean initialCheck = true;
    private final String translatePrompt = "请作为我的中日旅行口译：我输入或说中文时翻成自然礼貌的日语，日语翻成中文；默认只给译文，不添加解释。需要救急时优先准确传达情况，不编造症状、位置或个人信息。";

    @Override public void onCreate(Bundle saved) {
        super.onCreate(saved);
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(Color.rgb(242,245,248));
        root.setOnApplyWindowInsetsListener((v,insets) -> {
            if (android.os.Build.VERSION.SDK_INT >= 30) {
                android.graphics.Insets bars = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                v.setPadding(bars.left,bars.top,bars.right,bars.bottom);
            } else v.setPadding(0,insets.getSystemWindowInsetTop(),0,insets.getSystemWindowInsetBottom());
            return insets;
        });
        connection = new TextView(this);
        connection.setTextColor(Color.rgb(44,67,87));
        connection.setTextSize(12);
        connection.setPadding(dp(15),dp(6),dp(15),dp(3));
        root.addView(connection);
        LinearLayout nav = new LinearLayout(this);
        String[] names = {"行程", "急用", "翻译", "交接资料"};
        for (int i=0;i<names.length;i++) {
            final int which=i;
            Button button=new Button(this);
            button.setText(names[i]);button.setTextSize(14);button.setAllCaps(false);button.setMinWidth(0);
            button.setPadding(dp(4),0,dp(4),0);button.setTextColor(Color.rgb(24,60,87));
            button.setOnClickListener(v -> {
                if(which==0) web.loadUrl(BASE+"index.html#days");
                else if(which==1) showEmergency();
                else if(which==2) translationMenu();
                else web.loadUrl(BASE+"handoff/index.html");
            });
            nav.addView(button,new LinearLayout.LayoutParams(0,dp(49),1));
        }
        root.addView(nav);
        web = new WebView(this);
        root.addView(web,new LinearLayout.LayoutParams(-1,0,1));
        setContentView(root);
        WebSettings settings=web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setSupportMultipleWindows(true);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setTextZoom(100);
        CookieManager.getInstance().setAcceptThirdPartyCookies(web,false);
        WebViewAssetLoader loader=new WebViewAssetLoader.Builder()
            .addPathHandler("/assets/",new WebViewAssetLoader.AssetsPathHandler(this)).build();
        web.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view,WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest request) {
                Uri uri=request.getUrl();
                if (HOST.equals(uri.getHost()) && "https".equals(uri.getScheme())) return handleLocalDownload(uri);
                if (!request.isForMainFrame()) return false;
                openExternal(uri);
                return true;
            }
        });
        web.setDownloadListener((url,userAgent,disposition,mime,length) -> {
            if(!handleLocalDownload(Uri.parse(url)))Toast.makeText(this,"请通过手机浏览器下载此文件",Toast.LENGTH_LONG).show();
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onCreateWindow(WebView view,boolean dialog,boolean userGesture,android.os.Message resultMsg) {
                if(!userGesture)return false;
                WebView popup=new WebView(MainActivity.this);
                popup.setWebViewClient(new WebViewClient() {
                    @Override public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest req) {
                        Uri uri=req.getUrl();
                        if("https".equals(uri.getScheme()) && HOST.equals(uri.getHost())){if(!handleLocalDownload(uri))web.loadUrl(uri.toString());}
                        else openExternal(uri);
                        popup.destroy();return true;
                    }
                });
                ((WebView.WebViewTransport)resultMsg.obj).setWebView(popup);resultMsg.sendToTarget();return true;
            }
            @Override public boolean onShowFileChooser(WebView view,ValueCallback<Uri[]> callback,FileChooserParams params) {
                if(fileCallback!=null)fileCallback.onReceiveValue(null);
                fileCallback=callback;
                Intent intent=new Intent(Intent.ACTION_GET_CONTENT);
                intent.setType("image/*");intent.addCategory(Intent.CATEGORY_OPENABLE);
                try{startActivityForResult(intent,47);}catch(ActivityNotFoundException e){fileCallback.onReceiveValue(null);fileCallback=null;}
                return true;
            }
        });
        ConnectivityManager cm=(ConnectivityManager)getSystemService(CONNECTIVITY_SERVICE);
        networkCallback=new ConnectivityManager.NetworkCallback(){
            @Override public void onCapabilitiesChanged(android.net.Network n,NetworkCapabilities caps){runOnUiThread(()->updateConnection());}
            @Override public void onLost(android.net.Network n){runOnUiThread(()->updateConnection());}
        };
        cm.registerDefaultNetworkCallback(networkCallback);
        updateConnection();
        if(saved!=null)web.restoreState(saved);
        else web.loadUrl(BASE+(online()?"index.html#days":"emergency.html"));
    }
    private int dp(int value){return Math.round(value*getResources().getDisplayMetrics().density);}
    private boolean online(){
        ConnectivityManager cm=(ConnectivityManager)getSystemService(CONNECTIVITY_SERVICE);
        NetworkCapabilities caps=cm.getNetworkCapabilities(cm.getActiveNetwork());
        return caps!=null && caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED);
    }
    private void showEmergency(){web.loadUrl(BASE+"emergency.html");}
    private void updateConnection(){
        boolean current=online();
        connection.setText(current?"已联网 · 地图和AI可通过外部应用打开":"离线 · 急用、行程文字和图片均可查看");
        if(!initialCheck && previousOnline && !current && web.getUrl()!=null && !web.getUrl().contains("emergency.html"))showEmergency();
        previousOnline=current;initialCheck=false;
    }
    private void translationMenu(){
        if(!online()){
            new AlertDialog.Builder(this).setTitle("当前离线").setMessage("离线急用页已有日语求助卡，可直接放大给对方看。")
              .setPositiveButton("打开日语求助卡",(d,w)->web.loadUrl(BASE+"emergency.html#ek-help"))
              .setNegativeButton("取消",null).show();return;
        }
        new AlertDialog.Builder(this).setTitle("复制口译提示词并打开")
          .setItems(new String[]{"Gemini", "ChatGPT", "只复制口译提示词"},(dialog,which)->{
            ClipboardManager clipboard=(ClipboardManager)getSystemService(CLIPBOARD_SERVICE);
            clipboard.setPrimaryClip(ClipData.newPlainText("中日口译",translatePrompt));
            Toast.makeText(this,"口译提示词已复制，进入后粘贴即可",Toast.LENGTH_LONG).show();
            if(which==0)openAi("com.google.android.apps.bard","https://gemini.google.com/");
            else if(which==1)openAi("com.openai.chatgpt","https://chatgpt.com/");
          }).show();
    }
    private boolean handleLocalDownload(Uri uri){
        if(!HOST.equals(uri.getHost()))return false;
        String path=uri.getPath();
        if(path==null || !path.startsWith("/assets/handoff/"))return false;
        String filename=path.substring("/assets/handoff/".length());
        if(!(filename.equals("完整旅行内容.txt") || filename.equals("完整旅行内容.md") || filename.equals("行程数据.json") || filename.equals("工程接手说明.md")))return false;
        if(android.os.Build.VERSION.SDK_INT<29){Toast.makeText(this,"请在阅读页长按复制，或通过浏览器保存",Toast.LENGTH_LONG).show();return true;}
        ContentValues values=new ContentValues();
        values.put(MediaStore.MediaColumns.DISPLAY_NAME,filename);
        values.put(MediaStore.MediaColumns.MIME_TYPE,filename.endsWith("json")?"application/json":"text/plain");
        values.put(MediaStore.MediaColumns.RELATIVE_PATH,"Download/日本旅行交接");
        values.put(MediaStore.MediaColumns.IS_PENDING,1);
        Uri output=null;
        try{
            output=getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI,values);
            if(output==null)throw new IOException("Unable to create download");
            try(InputStream in=getAssets().open("handoff/"+filename);OutputStream out=getContentResolver().openOutputStream(output)){
                if(out==null)throw new IOException("Unable to open download");
                byte[] buffer=new byte[16384];int count;
                while((count=in.read(buffer))!=-1)out.write(buffer,0,count);
            }
            values.clear();values.put(MediaStore.MediaColumns.IS_PENDING,0);getContentResolver().update(output,values,null,null);
            Toast.makeText(this,"已保存到 下载/日本旅行交接/"+filename,Toast.LENGTH_LONG).show();
        }catch(IOException|RuntimeException e){if(output!=null)getContentResolver().delete(output,null,null);Toast.makeText(this,"保存失败，可在阅读页长按复制",Toast.LENGTH_LONG).show();}
        return true;
    }
    private void openAi(String packageName,String url){
        Intent launch=getPackageManager().getLaunchIntentForPackage(packageName);
        if(launch!=null){try{startActivity(launch);return;}catch(ActivityNotFoundException ignored){}}
        openExternal(Uri.parse(url));
    }
    private void openExternal(Uri uri){
        String scheme=uri.getScheme();
        if(!("https".equals(scheme)||"http".equals(scheme)||"tel".equals(scheme)||"mailto".equals(scheme)))return;
        Intent intent=new Intent("tel".equals(scheme)?Intent.ACTION_DIAL:Intent.ACTION_VIEW,uri);
        String host=uri.getHost();
        if(host!=null && (host.equals("maps.google.com") || (host.equals("www.google.com") && uri.getPath()!=null && uri.getPath().startsWith("/maps")))) {
            Intent maps=new Intent(intent).setPackage("com.google.android.apps.maps");
            try{startActivity(maps);return;}catch(ActivityNotFoundException ignored){}
        }
        try{startActivity(intent);}catch(ActivityNotFoundException e){Toast.makeText(this,"没有可打开此链接的应用",Toast.LENGTH_LONG).show();}
    }
    @Override protected void onResume(){super.onResume();if(web!=null)updateConnection();}
    @Override protected void onSaveInstanceState(Bundle out){web.saveState(out);super.onSaveInstanceState(out);}
    @Override protected void onActivityResult(int request,int result,Intent data){
        super.onActivityResult(request,result,data);
        if(request==47 && fileCallback!=null){fileCallback.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(result,data));fileCallback=null;}
    }
    @Override public void onBackPressed(){if(web.canGoBack())web.goBack();else super.onBackPressed();}
    @Override protected void onDestroy(){if(networkCallback!=null)((ConnectivityManager)getSystemService(CONNECTIVITY_SERVICE)).unregisterNetworkCallback(networkCallback);if(fileCallback!=null)fileCallback.onReceiveValue(null);web.destroy();super.onDestroy();}
}
