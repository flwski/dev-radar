import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import Icon from '@expo/vector-icons/MaterialIcons';
import api from '../services/api';

export default function Main({ navigation }) {

    const [devs, setDevs] = useState([]);
    const [currentRegion, setCurrentRegion] = useState(null);
    const [techs, setTechs] = useState('');

    useEffect(() => {
        async function loadInitalPosition() {
            const { granted } = await requestPermissionsAsync();

            if (granted) {
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true,
                });

                const { latitude, longitude } = coords;

                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04
                });
                
                loadDevs();
            }
        }

        loadInitalPosition();
        

    }, []);

    async function loadDevs() {
        const { latitude, longitude } = currentRegion;

        const response = await api.get('/search', {
            params: {
                latitude,
                longitude,
                techs
            }
        });

        console.log(response);

        setDevs(response.data.devs);
    }

    function handleRegionChange(region) {
        setCurrentRegion(region);
    }

    if (!currentRegion) {
        return null;
    }

    return (
        <>
            <MapView
                onRegionChangeComplete={handleRegionChange}
                style={styles.map}
                initialRegion={currentRegion}>

                {devs.map(dev => (
                    <Marker key={dev._id} coordinate={{ latitude: dev.location.coordinates[1], longitude: dev.location.coordinates[0] }}>
                        <Image style={styles.avatar}
                            source={{ uri: dev.avatar_url }} />
                        <Callout onPress={() => navigation.navigate('Profile', { github_username: dev.github_username })}>
                            <View style={styles.callout}>
                                <Text style={styles.devName}>{dev.name}</Text>
                                <Text style={styles.devBio}>{dev.bio}</Text>
                                <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}

            </MapView>

            <View style={styles.searchForme}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar devs por techs ..."
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    autoCorrect={false}
                    onChangeText={text=>setTechs(text)}
                />

                <TouchableOpacity
                    onPress={loadDevs}
                    style={styles.loadButton}>
                    <Icon name="my-location" color="#fff" size={20} />
                </TouchableOpacity>

            </View>
        </>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#fff'
    },
    callout: {
        width: 200,
        padding: 10
    },
    devName: {
        fontWeight: 'bold',
        fontSize: 16
    },
    devBio: {
        color: '#666',
        marginTop: 5
    },
    devTechs: {
        marginTop: 5
    },
    searchForme: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row'
    },
    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#fff',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4
        },
        elevation: 3
    },
    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: '#8e4dff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
        elevation: 3
    }
});
