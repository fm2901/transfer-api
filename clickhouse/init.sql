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

insert into transfers(name,`date`,amount) values('Test', '2024-06-13', 100)
,('Test', '2024-07-13', 100),('Test', '2024-08-13', 100),('Test', '2024-09-13', 100)
,('Test', '2024-10-13', 100),('Test', '2024-11-13', 100),('Test', '2024-12-13', 100)
,('Test', '2025-01-13', 100),('Test', '2025-02-13', 100),('Test', '2025-03-13', 100)
,('Test', '2025-04-13', 100),('Test', '2024-05-13', 100),('Test', '2024-06-13', 100)