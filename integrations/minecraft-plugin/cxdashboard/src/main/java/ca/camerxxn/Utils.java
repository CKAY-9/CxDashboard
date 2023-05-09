package ca.camerxxn;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;

import org.bukkit.Bukkit;
import org.bukkit.plugin.Plugin;

public class Utils {
    public static Plugin getPlugin() {
        return Bukkit.getPluginManager().getPlugin("CxDashboard");
    }

    public static String httpGet(String url, String params) {
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(url + "?" + params))
                .GET()
                .build();

            HttpResponse<String> response =
                client.send(req, BodyHandlers.ofString());

            return response.body();
        } catch (IllegalArgumentException ex) {
            ex.printStackTrace();
            return "";
        } catch (IOException ex) {
            ex.printStackTrace();
            return "";
        } catch (InterruptedException ex) {
            ex.printStackTrace();
            return "";
        }
    }
}
