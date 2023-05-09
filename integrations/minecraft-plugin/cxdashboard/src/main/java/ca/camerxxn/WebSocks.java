package ca.camerxxn;

import java.net.URI;

import org.bukkit.Bukkit;
import org.bukkit.entity.Player;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

import com.google.gson.Gson;

class Connection {
    String id = "gameConnect";
    String dashID = Config.data.getString("cxdashboard.dashID");;
}

class UpdateServer {
    String id = "updateServer";
    String dashID = Config.data.getString("cxdashboard.dashID");;
    int avgPing = 0;
    int plyCount = 0;
    int staffCount = 0;
    double tps = 0;
}

public class WebSocks extends WebSocketClient {

    Gson gson = new Gson();

    public WebSocks(URI uri) {
        super(uri);
    }

    @Override
    public void onClose(int code, String reason, boolean remove) {

    }

    @Override
    public void onError(Exception ex) {

    }

    @Override
    public void onMessage(String msg) {

    }

    @Override
    public void onOpen(ServerHandshake handshake) {
        Connection connectionMessage = new Connection();
        String s = gson.toJson(connectionMessage);
        send(s);

        Utils.getPlugin().getServer().getScheduler().scheduleSyncRepeatingTask(Utils.getPlugin(), new Runnable() {
            @Override
            public void run() {
                // Update server info
                int staffCount = 0;
                int totalPing = 0;
                for (Player p : Bukkit.getOnlinePlayers()) {
                    if (p.isOp()) staffCount++;
                    totalPing += p.getPing();
                }
                int avgPing = 0;
                if (Bukkit.getOnlinePlayers().size() <= 0) {
                    avgPing = totalPing / 1;
                } else {
                    avgPing = totalPing / Bukkit.getOnlinePlayers().size();
                }

                UpdateServer us = new UpdateServer();
                us.tps = CxDashboard.tps;
                us.avgPing = avgPing;
                us.plyCount = Bukkit.getOnlinePlayers().size();
                us.staffCount = staffCount;

                send(gson.toJson(us));
                
            }
        }, 20*5, 20*5);
    }

}
