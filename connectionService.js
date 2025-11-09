import serverList from '../config/serverList.json';

export async function probeServer(server, timeout = 5000) {
  const start = Date.now();
  const hosts = [];
  // try https then http with host:port
  if (server.port === 443) {
    hosts.push(`https://${server.host}/`);
  } else {
    hosts.push(`http://${server.host}:${server.port}/`);
    hosts.push(`https://${server.host}:${server.port}/`);
  }
  for (const url of hosts) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      const resp = await fetch(url, { method: 'GET', signal: controller.signal });
      clearTimeout(id);
      if (resp) {
        const latency = Date.now() - start;
        return { ok: true, url, latency };
      }
    } catch (e) {
      // continue to next url
    }
  }
  return { ok: false };
}

export async function probeAllServers(setPings) {
  const results = {};
  for (const s of serverList) {
    const r = await probeServer(s, 4000);
    results[s.name] = r.ok ? r.latency : null;
    // update UI as we go
    if (setPings) setPings({...results});
  }
  return results;
}
