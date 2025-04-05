import { Image, TouchableOpacity, View, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { default as Text } from '../../../Components/Labels/CustomText'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors from '../../../styles/colors'
import LgText from '../../../Components/Labels/LgText'
import Divider from '../../../Components/Labels/Divider'
import Feather from '@expo/vector-icons/Feather'
import InputField from '../../../Components/Input/InputField'
import PrimeButton from '../../../Components/Buttons/PrimeButton'
import { useSelector } from 'react-redux'
import * as ImagePicker from 'expo-image-picker'
import { Camera } from 'expo-camera'
import api from '../../../Utils/axiosInstance'
import * as FileSystem from 'expo-file-system'
import { updateUserData } from '../../../States/Slice/userSlice'
import { useDispatch } from 'react-redux'

const Edit = ({ navigation }) => {
  const dispatch = useDispatch()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const user = useSelector(state => state.user.user)

  // console.log(user)
  useEffect(() => {
    setEmail(user?.email || '')
    setFirstName(user?.firstName || '')
    setLastName(user?.lastName || '')
    setName(user?.name || '')
    setPhone(user?.phone || '')
    setImage(user?.image || null)
  }, [user])

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync()
    return status === 'granted'
  }

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    return status === 'granted'
  }

  const handleImageSelection = () => {
    Alert.alert(
      'Profile Picture',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: () => takePhoto(),
        },
        {
          text: 'Choose from Gallery',
          onPress: () => pickImage(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true },
    )
  }

  const takePhoto = async () => {
    const hasCameraPermission = await requestCameraPermission()

    if (!hasCameraPermission) {
      Alert.alert(
        'Permission Required',
        'Camera permission is required to take photos',
      )
      return
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      })

      if (!result.canceled) {
        setImage(result.assets[0].uri)
      }
    } catch (error) {
      console.error('Error taking photo:', error)
      Alert.alert('Error', 'Failed to take photo')
    }
  }

  const pickImage = async () => {
    const hasMediaLibraryPermission = await requestMediaLibraryPermission()

    if (!hasMediaLibraryPermission) {
      Alert.alert(
        'Permission Required',
        'Media library permission is required to select images',
      )
      return
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      })

      if (!result.canceled) {
        setImage(result.assets[0].uri)
      }
    } catch (error) {
      console.error('Error picking image:', error)
      Alert.alert('Error', 'Failed to pick image')
    }
  }

  const convertImageToBase64 = async imageUri => {
    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      })
      return `data:image/jpeg;base64,${base64}`
    } catch (error) {
      console.error('Error converting image to base64:', error)
      throw new Error('Failed to convert image')
    }
  }

  const handleUpdate = async () => {
    if (!firstName || !lastName || !email) {
      Alert.alert('Validation Error', 'Please fill all required fields')
      return
    }

    setLoading(true)

    try {
      // Create update data object
      const updateData = {
        firstName,
        lastName,
        email,
        phone,
      }

      // Add name based on first and last name
      updateData.name = `${firstName} ${lastName}`.trim()

      if (image && image !== user?.image) {
        const imageBase64 = await convertImageToBase64(image)
        updateData.image = imageBase64
      }

      console.log('Update Data:', updateData)

      const response = await api.put(`/auth/${user._id}`, updateData)

      if (response.data.user) {
        Alert.alert('Success', 'Profile updated successfully')
        dispatch(updateUserData(response.data.user))
        navigation.goBack()
      } else {
        Alert.alert(
          'Error',
          response.data.message || 'Failed to update profile',
        )
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update profile',
      )
    } finally {
      setLoading(false)
    }
  }

  const Avatar = ({ image }) => {
    return (
      <Image
        source={{ uri: image }}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 100,
        }}
      />
    )
  }

  return (
    <SafeAreaView
      style={{
        position: 'relative',
        backgroundColor: colors.primary,
        flex: 1,
        width: '100%',
        padding: 10,
      }}
    >
      <LgText>Edit Profile</LgText>
      <View style={{ marginVertical: 10 }}>
        <Divider />
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: 200,
        }}
      >
        <View
          style={{
            height: 170,
            width: 170,
            borderRadius: 100,
            borderWidth: 2,
            position: 'relative',
          }}
        >
          <View style={{ borderRadius: 100, overflow: 'hidden' }}>
            {user?.image ? (
              <Avatar image={image} />
            ) : (
              <View
                style={{
                  borderWidth: 2,
                  width: '100%',
                  height: '100%',
                  borderRadius: 100,
                  overflow: 'hidden',
                  backgroundColor: colors.quinary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 10,
                }}
              >
                <Text style={{ fontSize: 40 }}>
                  {`${firstName?.charAt(0)?.toUpperCase() || ''}${lastName?.charAt(0)?.toUpperCase() || ''}`}
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={handleImageSelection}>
            <View
              style={{
                position: 'absolute',
                borderWidth: 1,
                zIndex: 10,
                backgroundColor: colors.quaternary,
                height: 45,
                width: 45,
                bottom: 0,
                right: 0,
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Feather name="edit-2" size={24} color="black" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ marginVertical: 10, gap: 20 }}>
        <View style={{ flexDirection: 'row' }}>
          <View
            style={{
              width: '49%',
              padding: 5,
              paddingLeft: 0,
              paddingVertical: 0,
            }}
          >
            <InputField
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              keyboardType="default"
              autoCapitalize="none"
            />
          </View>
          <View
            style={{
              width: '49%',
              padding: 5,
              paddingRight: 0,
              paddingVertical: 0,
            }}
          >
            <InputField
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              keyboardType="default"
              autoCapitalize="none"
            />
          </View>
        </View>
        <InputField
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <InputField
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="numeric"
        />
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          height: 100,
          zIndex: 100,
          width: '105%',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          padding: 10,
          gap: 10,
        }}
      >
        <PrimeButton
          text={loading ? 'Updating...' : 'Update'}
          onPress={handleUpdate}
          disabled={loading}
        />
        <PrimeButton
          text="Cancel"
          styles={{ backgroundColor: 'white' }}
          onPress={() => navigation.goBack()}
          disabled={loading}
        />
      </View>
    </SafeAreaView>
  )
}

export default Edit
