package ca.camerxxn;

import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.entity.PlayerDeathEvent;
import org.bukkit.event.player.AsyncPlayerChatEvent;
import org.bukkit.event.player.PlayerAdvancementDoneEvent;
import org.bukkit.event.player.PlayerCommandPreprocessEvent;
import org.bukkit.event.player.PlayerGameModeChangeEvent;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.event.player.PlayerKickEvent;
import org.bukkit.event.player.PlayerQuitEvent;

import com.google.gson.Gson;

class Message {
    String username = "";
    String id = "mcmessage";
    String dashID = Config.data.getString("cxdashboard.dashID");
    String uuid = "";
    String content = "";
}

class Log {
    String id = "gameLog";
    String dashID = Config.data.getString("cxdashboard.dashID");
    String log = "";
}

public class Events implements Listener {
    CxDashboard dashboard;
    Gson gson = new Gson();

    public Events(CxDashboard dashboard) {
        this.dashboard = dashboard;
        this.dashboard.getServer().getPluginManager().registerEvents(this, this.dashboard);
    }

    public void _log(String logToSend) {
        if (!dashboard.ws.getConnection().isOpen()) return;

        Log log = new Log();
        log.log = logToSend;
        dashboard.ws.send(gson.toJson(log));
    }

    @EventHandler
    public void onPlayerChat(AsyncPlayerChatEvent event) {
        if (!dashboard.ws.getConnection().isOpen()) return;
        
        Message msg = new Message();
        msg.content = event.getMessage();
        msg.username = event.getPlayer().getName();
        msg.uuid = event.getPlayer().getUniqueId().toString();

        dashboard.ws.send(gson.toJson(msg));
    }

    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        _log(event.getPlayer().getName() + " has joined the server!");
    }

    @EventHandler
    public void onPlayerLeave(PlayerQuitEvent event) {
        _log(event.getPlayer().getName() + " has left the server!");    
    }

    @EventHandler
    public void onPlayerDeath(PlayerDeathEvent event) {
        _log(event.getEntity().getName() + " has died: " + event.getDeathMessage());
    }

    @EventHandler
    public void onPlayerAdvancement(PlayerAdvancementDoneEvent event) {
        _log(event.getPlayer().getName() + " completed advancement: " + event.getAdvancement().getKey().getKey());
    }

    @EventHandler
    public void onPlayerCommand(PlayerCommandPreprocessEvent event) {
        _log(event.getPlayer().getName() + " executed a command: " + event.getMessage());
    }

    @EventHandler
    public void onPlayerKick(PlayerKickEvent event) {
        _log(event.getPlayer().getName() + " was kicked: " + event.getReason());
    }

    @EventHandler
    public void onPlayerGM(PlayerGameModeChangeEvent event) {
        _log(event.getPlayer().getName() + " changed gamemode: " + event.getNewGameMode());
    }
}
