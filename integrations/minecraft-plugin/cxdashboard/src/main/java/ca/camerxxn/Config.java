package ca.camerxxn;

import java.io.File;
import java.io.IOException;

import org.bukkit.configuration.file.YamlConfiguration;

public class Config {
    public static File dataFile;
    public static YamlConfiguration data;

    public static void initializeData() {
        try {
            dataFile = new File(Utils.getPlugin().getDataFolder(), "config.yml");
            if (!dataFile.exists()) {
                if (dataFile.getParentFile().mkdirs()) {
                    Utils.getPlugin().getLogger().info("Created data folder!");
                }
                if (dataFile.createNewFile()) {
                    Utils.getPlugin().getLogger().info("Created config file!");
                }
            }
            data = YamlConfiguration.loadConfiguration(dataFile);

            if (!data.isSet("cxdashboard.config.apiURL")) {
                data.set("cxdashboard.config.apiURL", "API_URL");
                data.set("cxdashboard.config.wsURL", "WEBSOCKET_URL");
                data.set("cxdashboard.dashID", "DONT_EDIT_THIS");
                Utils.getPlugin().getLogger().info("Created default config. Edit the config.yml file and restart your server!");
                data.save(dataFile);

                Utils.getPlugin().getPluginLoader().disablePlugin(Utils.getPlugin());
            }

            data.save(dataFile);
        } catch (IOException ex) {
            Utils.getPlugin().getLogger().warning(ex.toString());
        }
    }
}
