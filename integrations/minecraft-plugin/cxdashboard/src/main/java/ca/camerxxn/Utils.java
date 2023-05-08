package ca.camerxxn;

import org.bukkit.Bukkit;
import org.bukkit.plugin.Plugin;

public class Utils {
    public static Plugin getPlugin() {
        return Bukkit.getPluginManager().getPlugin("CxDashboard");
    }

    public static String httpReq(String url, String urlParamaters) {
       // Contact CxDashboard API
       String apiURL = Config.data.getString("cxdashboard.config.apiURL");
       HttpURLConnection connection = null;
       URL url = new URL(apiURL);
       connection = (HttpURLConnection) url.openConnection();
       connection.setRequestMethod("POST");
       connection.setRequestProperty("Content-Type", 
   "application/x-www-form-urlencoded");

       connection.setRequestProperty("Content-Length", 
       Integer.toString(urlParameters.getBytes().length));
       connection.setRequestProperty("Content-Language", "en-US");  

       connection.setUseCaches(false);
       connection.setDoOutput(true);

       DataOutput wr = new DataOutputStream (
       connection.getOutputStream());
       wr.writeBytes(urlParameters);
       wr.close();

//Get Response  
InputStream is = connection.getInputStream();
BufferedReader rd = new BufferedReader(new InputStreamReader(is));
StringBuilder response = new StringBuilder(); // or StringBuffer if Java version 5+
String line;
while ((line = rd.readLine()) != null) {
 response.append(line);
 response.append('\r');
}
rd.close();
return response.toString();
} catch (Exception e) {
e.printStackTrace();
return null;
} finally {
if (connection != null) {
 connection.disconnect();
}
    }
}
