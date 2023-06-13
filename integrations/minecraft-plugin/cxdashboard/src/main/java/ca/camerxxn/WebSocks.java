package ca.camerxxn;

import java.net.URI;

import org.bukkit.Bukkit;
import org.bukkit.entity.Player;
import org.bukkit.scheduler.BukkitRunnable;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

import com.google.gson.Gson;

class Connection {
    String id = "gameConnect";
    String dashID = Config.data.getString("cxdashboard.dashID");
}

class UpdateServer {
    String id = "updateServer";
    String dashID = Config.data.getString("cxdashboard.dashID");
    int avgPing = 0;
    int plyCount = 0;
    int staffCount = 0;
    double tps = 0;
}

class GameCommand {
    String id = "gameCommand";
    String command = "";
    String dashID = Config.data.getString("cxdashboard.dashID");
}

class ReceivingMessage {
    String id = "";
    String dashID = Config.data.getString("cxdashboard.dashID");
    String data = "";
}

class DisconnectSend {
    String id = "gameDisconnect";
    String dashID = Config.data.getString("cxdashboard.dashID");
}

public class WebSocks extends WebSocketClient {

    Gson gson = new Gson();

    public WebSocks(URI uri) {
        super(uri);
    }

    public static void disconnectFromServer(WebSocketClient ws) {
        if (!ws.isOpen()) return;

        DisconnectSend disconnect = new DisconnectSend();
        Gson g = new Gson();
        ws.send(g.toJson(disconnect));

        ws.close();
    }

    @Override
    public void onClose(int code, String reason, boolean remove) {
        if (isOpen()) return;

        DisconnectSend disconnect = new DisconnectSend();
        Gson g = new Gson();
        send(g.toJson(disconnect));

        close();
              
    }

    @Override
    public void onError(Exception ex) {

    }

    @Override
    public void onMessage(String msg) {
        Utils.getPlugin().getLogger().info(msg);
        ReceivingMessage message = gson.fromJson(msg, ReceivingMessage.class);
        switch (message.id) {
            case "gameCommand":
                GameCommand command = gson.fromJson(message.data, GameCommand.class);
                if (command.command == null) {
                    Utils.getPlugin().getLogger().warning("Failed to parse game command message!");
                    return;
                }
                
                // Dispatch Command is async and required a runTask
                new BukkitRunnable() {
                    @Override
                    public void run() {
                        Bukkit.dispatchCommand(Bukkit.getConsoleSender(), command.command);
                    }
                }.runTask(Utils.getPlugin());
    
                break;
        } 
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
