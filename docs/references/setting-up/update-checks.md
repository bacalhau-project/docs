---
icon: bolt-auto
---

# Automatic Update Checking

Bacalhau has an update checking service to automatically detect whether a newer version of the software is available.

Users who are both running CLI commands and operating nodes will be regularly informed that a new release can be downloaded and installed.

## For clients

Bacalhau will run an update check regularly when client commands are executed. If an update is available, explanatory text will be printed at the end of the command.

To force a manual update check, run the `bacalhau version` command, which will explicitly list the latest software release alongside the server and client versions.

<pre class="language-shell"><code class="lang-shell">bacalhau version
<strong>
</strong><strong># expected output
</strong><strong># might show client version only if client is not connected to any orchestrator
</strong><strong>
</strong><strong>CLIENT  SERVER  LATEST  UPDATE MESSAGE 
</strong> v1.5.1  v1.5.1  1.5.1
</code></pre>

## For node operators

Bacalhau will run an update check regularly as part of the normal operation of the node.

If an update is available, an INFO level message will be printed to the log.

## Configuring checks

Bacalhau has some configuration options for controlling how often checks are performed. By default, an update check will run no more than once every 24 hours. Users can opt out of automatic update checks using the configuration described below.

| Config property       | Environment variable             | Default value | Meaning                                                                                                                                                                                                          |
| --------------------- | -------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UpdateConfig.Interval | `BACALHAU_UPDATE_CHECKFREQUENCY` | `24h0m0s`     | <p>The minimum amount of time between automated update checks. Set as any duration of hours, minutes or seconds, e.g. <code>24h</code> or <code>10m</code>. When set to 0 update checks<br>are not performed</p> |

:::info
It's important to note that disabling the automatic update checks may lead to potential issues, arising from mismatched versions of different actors within Bacalhau.
:::

To output update check config, run `bacalhau config list`:

```shell
bacalhau config list | grep UpdateConfig
 UpdateConfig.Interval   24h0m0s   Interval specifies the time between update checks, when set to 0 update checks are not performed.
```

## Support <a href="#support" id="support"></a>

If you have questions or need support or guidance, please reach out to the [Bacalhau team via Slack](https://bacalhauproject.slack.com/ssb/redirect) (**#general** channel).
