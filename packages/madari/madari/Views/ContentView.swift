import SwiftUI
import streamio_addon_sdk

struct ContentView: View {
    @State private var selectedTab: NavigationItem = .home
    @State private var selectedSidebarItem: NavigationItem = .home
    @State private var isVideoPlayerActive = false
    @StateObject private var manager = AddonManager.shared
    @StateObject private var coordinator = NavigationCoordinator.shared
    @State private var columnVisibility: NavigationSplitViewVisibility = .automatic
    @State private var currentStream: AddonStreamItem?
    @State private var currentMeta: AddonMetaMeta?
    
    var mainContent: some View {
#if os(macOS)
        NavigationStack(path: $coordinator.navigationPath) {
            ZStack {
                HSplitView {
                    List(NavigationItem.allCases, id: \.self, selection: $selectedSidebarItem) { item in
                        Label {
                            Text(item.rawValue)
                                .foregroundColor(.primary)
                        } icon: {
                            Image(systemName: item.icon)
                        }
                    }
                    .listStyle(.sidebar)
                    .frame(minWidth: 200, maxWidth: 300)
                    
                    destinationView(for: selectedSidebarItem)
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                }
            }
            .navigationDestination(for: NavigationItem.self) { item in
                destinationView(for: item)
            }
            .navigationDestination(for: AddonMetaMeta.self) { meta in
                DetailView(meta: meta)
            }
            .navigationDestination(for: NavigationStream.self) { navigateStream in
                VideoPlayerView(
                    stream: navigateStream.stream,
                    meta: navigateStream.meta
                )
                .navigationBarBackButtonHidden()
                .ignoresSafeArea()
                .onDisappear {
                    self.isVideoPlayerActive = false
                    self.currentStream = nil
                    self.currentMeta = nil
                }
            }
        }
        
#else
        // iOS TabBar Navigation remains the same...
        NavigationStack(path: $coordinator.navigationPath) {
            TabView(selection: $selectedTab) {
                ForEach(NavigationItem.allCases, id: \.self) { item in
                    destinationView(for: item)
                        .tabItem {
                            Image(systemName: item.icon)
                            Text(item.rawValue)
                        }
                        .tag(item)
                }
            }
            .navigationDestination(for: NavigationItem.self) { item in
                destinationView(for: item)
            }
            .navigationDestination(for: AddonMetaMeta.self) { meta in
                DetailView(meta: meta)
            }
            .navigationDestination(for: NavigationStream.self) { navigateStream in
                VideoPlayerView(stream: navigateStream.stream, meta: navigateStream.meta)
                    .navigationBarBackButtonHidden()
                    .ignoresSafeArea()
                    .tabBarHidden(true)
            }
        }
        .ignoresSafeArea(.all, edges: .all)
        .navigationBarHidden(isVideoPlayerActive)
        .tabBarHidden(isVideoPlayerActive)
#endif
    }
    
    @ViewBuilder
    func destinationView(for item: NavigationItem) -> some View {
        switch item {
        case .home:
            ContentGridView()
        case .movies:
            ContentGridView(type: .movie)
        case .series:
            ContentGridView(type: .series)
        case .settings:
            SettingsView()
        }
    }
    
    var body: some View {
        Group {
            if manager.isReady {
                mainContent
            } else {
                loadingView
            }
        }
    }
    
    
    var loadingView: some View {
        Group {
            switch manager.loadingState {
            case .notStarted:
                ProgressView("Preparing...")
                
            case .loading(let progress, let total):
                CircularProgressView(
                    progress: progress,
                    current: Int(progress * Double(total)),
                    total: total,
                    title: "Loading Addons..."
                )
                
            case .failed(let error):
                VStack {
                    Image(systemName: "exclamationmark.triangle")
                        .font(.largeTitle)
                        .foregroundColor(.red)
                    Text("Failed to load addons")
                        .font(.headline)
                    Text(error.localizedDescription)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
            case .loaded:
                EmptyView()
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

#Preview {
    ContentView()
}