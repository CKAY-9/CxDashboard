require("gwsockets")

if (not file.Exists("cxdb/data.json", "DATA")) then
    file.CreateDir("cxdb")
    file.Write("cxdb/data.json", util.TableToJSON({}, true))
    print("[CxDashboard] Created CxDashboard data files!")
end

DASHBOARD.fileData = file.Read("cxdb/data.json", "DATA")
DASHBOARD.data = util.JSONToTable(DASHBOARD.fileData)

DASHBOARD.socks = function()
    print("[CxDashboard] There must be playes online for websockets to work!")
    local socket = GWSockets.createWebSocket("ws://localhost:3002")
    local delay = 0

    hook.Add("Think", "CXDB.ThinkCycle", function()
        if (CurTime() < delay) then return end
        local staffCount = 0
        local pingTotal = 0
        for key, value in ipairs(player.GetAll()) do
            if (value:IsAdmin()) then
                staffCount = staffCount + 1
            end
            pingTotal = pingTotal + value:Ping()
        end

        socket:write(util.TableToJSON({
            id = "updateServer",
            dashID = DASHBOARD.data["dashID"],
            plyCount = #player.GetAll(),
            map = game.GetMap(),
            gamemode = gmod.GetGamemode().Name,
            staffCount = staffCount,
            avgPing = pingTotal / #player.GetAll()
        }, true))

        delay = CurTime() + 5
    end)

    hook.Add("PlayerSay", "CXDB.PlayerChat", function(ply, text, team)
        socket:write(util.TableToJSON({
            id = "gmodmessage",
            steamID = ply:SteamID64(),
            name = ply:GetName(),
            dashID = DASHBOARD.data["dashID"],
            text = text
        }, true))
    end)

    function socket:onMessage(msg)  end

    function socket:onError(errMessage)
        print("[CxDashboard]" .. errMessage)
    end

    function socket:onConnected()
        print("[CxDashboard] Connected to socket Server!")
        socket:write(util.TableToJSON({
            id = "gameConnect",
            dashID = DASHBOARD.data["dashID"]
        }, true))
    end

    function socket:onDisconnected()
        
    end

    socket:open()
end

timer.Simple(0, function()
    print("[CxDashboard] Contacting API service...")
    if (DASHBOARD.data["dashID"] == nil) then
        http.Fetch(DASHBOARD.apiServer .. "/integration/dashID?game=gmod",
            function(body)
                print(body)
                local id = util.JSONToTable(body)["dashID"]
                DASHBOARD.data["dashID"] = id
                file.Write("cxdb/data.json", util.TableToJSON(DASHBOARD.data, true))
                print("[CxDashboard] Registered Dashboard ID!")
                print("####################################")
                for var = 0, 5 do
                    print(" ")
                end
                print("[CxDashboard] Your servers DashID: " .. id .. " (This can be found in data/cxdb/data.json)")
                for var = 0, 5 do
                    print(" ")
                end
                print("####################################")
                DASHBOARD.socks()
            end,
            function (message)
                print(message)
            end
        )
    else
        DASHBOARD.socks()
    end
    -- TODO: Check if server still exists
end)