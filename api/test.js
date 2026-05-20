import { SystemBus } from "dbus-next";

async function test() {
  const bus = SystemBus();

  const obj = await bus.getProxyObject(
    "org.freedesktop.systemd1",
    "/org/freedesktop/systemd1"
  );

  const manager = obj.getInterface("org.freedesktop.systemd1.Manager");

  const units = await manager.ListUnits();

  console.log("CONNECTED. Units:", units.length);
}

test().catch(console.error);