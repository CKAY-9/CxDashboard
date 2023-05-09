package ca.camerxxn;
import org.bukkit.Bukkit;
import org.bukkit.plugin.Plugin;

public class Utils {
    public static Plugin getPlugin() {
        return Bukkit.getPluginManager().getPlugin("CxDashboard");
    }
}
