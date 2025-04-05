import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import api from '../../Utils/axiosInstance'
import { updateUserData } from '../../States/Slice/userSlice'

const Intro = ({ navigation }) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [ageError, setAgeError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { user, isAuthenticated, loading } = useSelector(state => state.user)
  const dispatch = useDispatch()

  const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say']

  const validateAge = value => {
    const numAge = parseInt(value)
    if (isNaN(numAge)) {
      setAgeError('Please enter a valid age')
      return false
    } else if (numAge < 13 || numAge > 120) {
      setAgeError('Age must be between 13 and 120')
      return false
    } else {
      setAgeError('')
      return true
    }
  }

  const handleContinue = async () => {
    console.log('id', user._id)
    if (validateAge(age) && gender && firstName.trim() && lastName.trim()) {
      try {
        setIsSubmitting(true)

        const userData = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          age: parseInt(age),
          gender,
        }

        // Make API call to update user
        const response = await api.put(`/auth/${user._id}`, userData)

        // Handle success
        if (response.data && response.data.user) {
          // You might want to update the Redux store with the updated user
          dispatch(updateUserData(response.data.user))

          // Navigate to next screen
          navigation.navigate('ClientStack')
        }
      } catch (error) {
        console.error('Registration Error:', {
          message: error.message,
          code: error.code,
          response: error.response?.data,
          stack: error.stack,
        })

        // dispatch(setError(error.response?.data?.message || error.message))
        Alert.alert('Error', error.response?.data?.message || error.message)
      } finally {
        setIsSubmitting(false)
      }
    } else if (!firstName.trim()) {
      Alert.alert('Missing Information', 'Please enter your first name')
    } else if (!lastName.trim()) {
      Alert.alert('Missing Information', 'Please enter your last name')
    } else if (!gender) {
      Alert.alert('Missing Information', 'Please select a gender option')
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Help us get to know you</Text>
        <Text style={styles.subtitle}>
          We use this information to personalize your experience
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>What's your name?</Text>
          <TextInput
            style={styles.input}
            placeholder="First name"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Last name"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>How old are you?</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your age"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
            maxLength={3}
          />
          {ageError ? <Text style={styles.errorText}>{ageError}</Text> : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>What's your gender?</Text>
          <View style={styles.optionsContainer}>
            {genderOptions.map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  gender === option && styles.selectedOption,
                ]}
                onPress={() => setGender(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    gender === option && styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.continueButton,
          (isSubmitting ||
            !firstName.trim() ||
            !lastName.trim() ||
            !age ||
            !gender) &&
            styles.disabledButton,
        ]}
        onPress={handleContinue}
        disabled={
          isSubmitting ||
          !firstName.trim() ||
          !lastName.trim() ||
          !age ||
          !gender
        }
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.continueButtonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginTop: 40,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 6,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    margin: 5,
    backgroundColor: '#F9F9F9',
  },
  selectedOption: {
    borderColor: '#007AFF',
    backgroundColor: '#E5F1FF',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedOptionText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#B3D7FF',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
})

export default Intro
