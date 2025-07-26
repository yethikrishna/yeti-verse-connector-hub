-- Create user_connections table for storing platform connections
CREATE TABLE IF NOT EXISTS user_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    platform_id TEXT NOT NULL,
    platform_name TEXT NOT NULL,
    credentials JSONB NOT NULL DEFAULT '{}',
    settings JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    last_connected TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, platform_id)
);

-- Create mcp_execution_logs table for logging platform operations
CREATE TABLE IF NOT EXISTS mcp_execution_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    platform_id TEXT NOT NULL,
    action TEXT NOT NULL,
    request_data JSONB,
    response_data JSONB,
    status TEXT CHECK (status IN ('success', 'error', 'pending')) DEFAULT 'pending',
    error_message TEXT,
    execution_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create oauth_states table for OAuth flow state management
CREATE TABLE IF NOT EXISTS oauth_states (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    platform_id TEXT NOT NULL,
    state_token TEXT NOT NULL UNIQUE,
    redirect_uri TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_connections_user_id ON user_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_user_connections_platform_id ON user_connections(platform_id);
CREATE INDEX IF NOT EXISTS idx_mcp_execution_logs_user_id ON mcp_execution_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_mcp_execution_logs_platform_id ON mcp_execution_logs(platform_id);
CREATE INDEX IF NOT EXISTS idx_oauth_states_state_token ON oauth_states(state_token);
CREATE INDEX IF NOT EXISTS idx_oauth_states_expires_at ON oauth_states(expires_at);

-- Add RLS (Row Level Security)
ALTER TABLE user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcp_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_states ENABLE ROW LEVEL SECURITY;

-- Create policies for user_connections
CREATE POLICY "Users can view their own connections" ON user_connections
    FOR SELECT USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can insert their own connections" ON user_connections
    FOR INSERT WITH CHECK (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can update their own connections" ON user_connections
    FOR UPDATE USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can delete their own connections" ON user_connections
    FOR DELETE USING (auth.uid()::TEXT = user_id);

-- Create policies for mcp_execution_logs
CREATE POLICY "Users can view their own execution logs" ON mcp_execution_logs
    FOR SELECT USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can insert their own execution logs" ON mcp_execution_logs
    FOR INSERT WITH CHECK (auth.uid()::TEXT = user_id);

-- Create policies for oauth_states
CREATE POLICY "Users can view their own oauth states" ON oauth_states
    FOR SELECT USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can insert their own oauth states" ON oauth_states
    FOR INSERT WITH CHECK (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can delete their own oauth states" ON oauth_states
    FOR DELETE USING (auth.uid()::TEXT = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for user_connections
CREATE TRIGGER update_user_connections_updated_at
    BEFORE UPDATE ON user_connections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to cleanup expired OAuth states
CREATE OR REPLACE FUNCTION cleanup_expired_oauth_states()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM oauth_states WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;