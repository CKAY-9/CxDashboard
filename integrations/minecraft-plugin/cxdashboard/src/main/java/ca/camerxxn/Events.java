package ca.camerxxn;

import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.AsyncPlayerChatEvent;

import com.google.gson.Gson;

class Message {
    String username = "";
    String id = "mcmessage";
    String dashID = Config.data.getString("cxdashboard.dashID");
    String uuid = "";
    String content = "";
}

public class Events implements Listener {
    CxDashboard dashboard;
    Gson gson = new Gson();

    public Events(CxDashboard dashboard) {
        this.dashboard = dashboard;
        this.dashboard.getServer().getPluginManager().registerEvents(this, this.dashboard);
    }

    @EventHandler
    public void onPlayerChat(AsyncPlayerChatEvent event) {
        if (dashboard.ws.getConnection().isOpen()) {
            Message msg = new Message();
            msg.content = event.getMessage();
            msg.username = event.getPlayer().getName();
            msg.uuid = event.getPlayer().getUniqueId().toString();

            dashboard.ws.send(gson.toJson(msg));
        }
    }
}
