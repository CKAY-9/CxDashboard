package ca.camerxxn;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import org.bukkit.plugin.java.JavaPlugin;
import org.java_websocket.client.WebSocketClient;

import com.google.gson.Gson;

class DashIDResponse {
    public String dashID;
}

public class CxDashboard extends JavaPlugin {
    WebSocketClient ws;
    public static double tps;

    @Override
    public void onEnable() {
        Config.initializeData();
        
        this.getServer().getScheduler().scheduleSyncRepeatingTask(this, new Runnable() {
            long secstart;
            long secend;
            int ticks;
    
            @Override
            public void run() {
                secstart = (System.currentTimeMillis() / 1000);
                if (secstart == secend) {
                    ticks++;
                } else {
                    secend = secstart;
                    CxDashboard.tps = (CxDashboard.tps == 0) ? ticks : ((CxDashboard.tps + ticks) / 2);
                    ticks = 1;
                }
            }
        }, 0, 1);

        try {
            if (!Config.data.getString("cxdashboard.config.apiURL").equalsIgnoreCase("API_URL") && Config.data.getString("cxdashboard.dashID").equalsIgnoreCase("")) {
                // Receive dash ID
                String request = Utils.httpGet(Config.data.getString("cxdashboard.config.apiURL") + "/integration/dashID", "game=mc");
                Gson gson = new Gson();
                DashIDResponse parsed = gson.fromJson(request, DashIDResponse.class);
                Config.data.set("cxdashboard.dashID", parsed.dashID);
                Config.data.save(Config.dataFile);
                
                // Alert console
                getLogger().info("######################################");
                for (int i = 0; i < 5; i++) {
                    getLogger().info("");
                }
                getLogger().info("Minecraft server DashID: " + parsed.dashID + " (This can later be found in plugins/cxdb/config.yml)");
                for (int i = 0; i < 5; i++) {
                    getLogger().info("");
                }
                getLogger().info("######################################");
            }
        } catch (IOException ex) {
            ex.printStackTrace();
        }
        
        String wsURI = Config.data.getString("cxdashboard.config.wsURL");
        if (wsURI != null) {
            try {
                new Events(this);
                ws = new WebSocks(new URI(wsURI));
                ws.connect();
            } catch (URISyntaxException e) {
                e.printStackTrace();
            }
        }

    }

    @Override
    public void onDisable() {
        WebSocks.disconnectFromServer(ws);
    }
}
