//
//  MetaSectionView.swift
//  madari
//
//  Created by Omkar Yadav on 12/11/24.
//


import SwiftUI
import streamio_addon_sdk

struct MetaSectionView: View {
    let meta: AddonMetaMeta
    
    private var castLinks: [AddonMetaLink] {
        meta.links?.filter { $0.category == "Cast" } ?? []
    }
    
    private var crewLinks: [AddonMetaLink] {
        meta.links?.filter { $0.category == "Writers" || $0.category == "Directors" } ?? []
    }
    
    private var genreLinks: [AddonMetaLink] {
        meta.links?.filter { $0.category == "Genres" } ?? []
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 32) {
            // Cast Section
            if !castLinks.isEmpty {
                VStack(alignment: .leading, spacing: 16) {
                    Text("Cast")
                        .font(.title2)
                        .fontWeight(.bold)
                        .padding(.horizontal, 20)
                    
                    ScrollView(.horizontal, showsIndicators: false) {
                        LazyHStack(spacing: 24) {
                            ForEach(castLinks, id: \.url) { link in
                                VStack(alignment: .center, spacing: 12) {
                                    Circle()
                                        .fill(Color.gray.opacity(0.2))
                                        .frame(width: 100, height: 100)
                                        .overlay(
                                            Image(systemName: "person.fill")
                                                .resizable()
                                                .scaledToFit()
                                                .foregroundColor(.gray)
                                                .padding(25)
                                        )
                                    
                                    Text(link.name)
                                        .font(.callout)
                                        .multilineTextAlignment(.center)
                                        .lineLimit(2)
                                        .frame(width: 100)
                                }
                            }
                        }
                        .padding(.horizontal, 20)
                    }
                }
            }
            
            // Crew Section
            if !crewLinks.isEmpty {
                VStack(alignment: .leading, spacing: 16) {
                    Text("Crew")
                        .font(.title2)
                        .fontWeight(.bold)
                        .padding(.horizontal, 20)
                    
                    LazyVStack(alignment: .leading, spacing: 16) {
                        ForEach(crewLinks, id: \.url) { link in
                            VStack(alignment: .leading, spacing: 6) {
                                Text(link.category)
                                    .font(.subheadline)
                                    .foregroundColor(.gray)
                                Text(link.name)
                                    .font(.body)
                            }
                        }
                    }
                    .padding(.horizontal, 20)
                }
            }
            
            // Genres Section
            if !genreLinks.isEmpty {
                VStack(alignment: .leading, spacing: 16) {
                    Text("Genres")
                        .font(.title2)
                        .fontWeight(.bold)
                        .padding(.horizontal, 20)
                    
                    FlowLayout(spacing: 12) {
                        ForEach(genreLinks, id: \.url) { link in
                            Text(link.name)
                                .font(.callout)
                                .padding(.horizontal, 16)
                                .padding(.vertical, 8)
                                .background(Color.blue.opacity(0.1))
                                .foregroundColor(.blue)
                                .clipShape(Capsule())
                        }
                    }
                    .padding(.horizontal, 20)
                }
            }
        }
        .padding(.vertical, 24)
    }
}
