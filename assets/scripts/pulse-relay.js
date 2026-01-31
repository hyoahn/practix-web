/**
 * Practix Pulse Relay
 * Global real-time event aggregation via Supabase.
 */

const RELAY_CONFIG = {
    url: 'https://ojaglhuflcwmooqyenrp.supabase.co',
    key: 'sb_publishable_WT2uhNDuPL6i39YnfdhMfw_x1nPeNgi',
    table: 'practix_events'
};

let supabaseClient = null;
let relayInitPromise = null;

/**
 * Initialize the Relay
 */
async function initRelay() {
    if (relayInitPromise) return relayInitPromise;

    relayInitPromise = (async () => {
        if (RELAY_CONFIG.url === 'YOUR_SUPABASE_URL') {
            console.warn('📡 Pulse Relay: Credentials missing. Running in local-only mode.');
            return;
        }

        // Load SDK dynamically if missing
        if (!window.supabase) {
            console.log('📡 Pulse Relay: Loading Supabase SDK...');
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
                script.onload = resolve;
                script.onerror = () => reject(new Error('Supabase SDK fail'));
                document.head.appendChild(script);
            });
        }

        if (window.supabase) {
            supabaseClient = window.supabase.createClient(RELAY_CONFIG.url, RELAY_CONFIG.key);
            console.log('📡 Pulse Relay: Connected to Supabase.');
            return true;
        } else {
            console.error('📡 Pulse Relay: Supabase SDK failed to load.');
            return false;
        }
    })();

    return relayInitPromise;
}

/**
 * Broadcast an event to the global relay
 */
async function broadcastEvent(eventName, params = {}) {
    console.log(`📡 Pulse Relay Attempting: ${eventName}`, params);

    // Wait for init to finish if it's already started
    if (relayInitPromise) await relayInitPromise;

    if (!supabaseClient) {
        console.error('📡 Pulse Relay: Cannot broadcast, client not initialized.');
        return;
    }

    try {
        const { error } = await supabaseClient
            .from(RELAY_CONFIG.table)
            .insert([
                {
                    event_name: eventName,
                    params: params,
                    location: window.location.pathname
                }
            ]);

        if (error) throw error;
        console.log(`📡 Pulse Relay Success: ${eventName}`);
    } catch (err) {
        console.error('📡 Pulse Relay Error:', err);
    }
}

/**
 * Subscribe to the live event stream (for Dashboard)
 */
async function subscribeToEvents(onEvent) {
    if (relayInitPromise) await relayInitPromise;
    if (!supabaseClient) return;

    return supabaseClient
        .channel('public:practix_events')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: RELAY_CONFIG.table }, payload => {
            onEvent(payload.new);
        })
        .subscribe();
}

/**
 * Fetch historical counts (for Dashboard load)
 * Supports filtering by params and time
 */
async function getEventCounts(eventName, filters = {}, since = null) {
    if (relayInitPromise) await relayInitPromise;
    if (!supabaseClient) return 0;

    let query = supabaseClient
        .from(RELAY_CONFIG.table)
        .select('*', { count: 'exact', head: true })
        .eq('event_name', eventName);

    if (since) {
        query = query.gte('created_at', since);
    }

    // Apply filters to params JSON column
    for (const [key, value] of Object.entries(filters)) {
        query = query.contains('params', { [key]: value });
    }

    const { count, error } = await query;
    return error ? 0 : count;
}

// Auto-init on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRelay);
} else {
    initRelay();
}

window.PulseRelay = {
    broadcast: broadcastEvent,
    subscribe: subscribeToEvents,
    getCounts: getEventCounts
};
