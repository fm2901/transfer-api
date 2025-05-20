CREATE TABLE IF NOT EXISTS default.transfers (
                                                 name String,
                                                 date Date,
                                                 amount Float64
) ENGINE = MergeTree()
    ORDER BY (name, date);

CREATE TABLE IF NOT EXISTS default.api_keys (
                                                key String,
                                                allowed_ips Array(String)
    ) ENGINE = MergeTree()
    ORDER BY key;

INSERT INTO default.api_keys (key, allowed_ips) VALUES
                                                    ('key1', ['192.168.1.1', '10.0.0.0/8']),
                                                    ('admin', ['0.0.0.0/0']);
