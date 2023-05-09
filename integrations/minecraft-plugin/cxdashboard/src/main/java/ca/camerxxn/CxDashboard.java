package ca.camerxxn;

import java.net.URI;
import java.net.URISyntaxException;
import org.bukkit.plugin.java.JavaPlugin;
import org.java_websocket.client.WebSocketClient;

public class CxDashboard extends JavaPlugin {
    WebSocketClient ws;

    @Override
    public void onEnable() {
        Config.initializeData();

        if (!Config.data.getString("cxdashboard.config.apiURL").equalsIgnoreCase("API_URL")) {

            String wsURI = Config.data.getString("cxdashboard.config.wsURL");
            if (wsURI == null) {
                return;
            }

            try {
                ws = new WebSocks(new URI(wsURI));
            } catch (URISyntaxException e) {
                e.printStackTrace();
            }
        }

    }

    @Override
    public void onDisable() {

    }
}
