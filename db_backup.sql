--
-- PostgreSQL database dump
--

\restrict jdN0gVXGvBImK3UjNxLunt1kCGmytcaVSVl1XLJWJVLteB3Pn8wCwuCNVDaer3M

-- Dumped from database version 17.9
-- Dumped by pg_dump version 17.9

-- Started on 2026-05-24 23:35:08

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 873 (class 1247 OID 16390)
-- Name: booking_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.booking_status AS ENUM (
    'Pending',
    'Confirmed',
    'Cancelled'
);


ALTER TYPE public.booking_status OWNER TO postgres;

--
-- TOC entry 927 (class 1247 OID 16668)
-- Name: inquiry_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.inquiry_status AS ENUM (
    'Pending',
    'Reviewed'
);


ALTER TYPE public.inquiry_status OWNER TO postgres;

--
-- TOC entry 876 (class 1247 OID 16406)
-- Name: payment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_status AS ENUM (
    'Pending',
    'Completed',
    'Failed'
);


ALTER TYPE public.payment_status OWNER TO postgres;

--
-- TOC entry 879 (class 1247 OID 16414)
-- Name: reservation_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.reservation_status AS ENUM (
    'Reserved',
    'Checked_In',
    'Checked_Out',
    'Cancelled'
);


ALTER TYPE public.reservation_status OWNER TO postgres;

--
-- TOC entry 882 (class 1247 OID 16424)
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'Manager',
    'Staff',
    'Guide',
    'Tourist',
    'Driver'
);


ALTER TYPE public.user_role OWNER TO postgres;

--
-- TOC entry 885 (class 1247 OID 16436)
-- Name: user_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_status AS ENUM (
    'Active',
    'Inactive',
    'Blocked'
);


ALTER TYPE public.user_status OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 16443)
-- Name: booking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.booking (
    booking_id integer NOT NULL,
    booking_date date DEFAULT CURRENT_TIMESTAMP NOT NULL,
    travel_date date NOT NULL,
    no_of_travelers integer NOT NULL,
    status public.booking_status DEFAULT 'Pending'::public.booking_status,
    tourist_id integer NOT NULL,
    package_id integer NOT NULL,
    total_price numeric(10,2),
    CONSTRAINT booking_no_of_travelers_check CHECK ((no_of_travelers > 0)),
    CONSTRAINT booking_travel_date_check CHECK ((travel_date >= CURRENT_DATE))
);


ALTER TABLE public.booking OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16450)
-- Name: booking_booking_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.booking ALTER COLUMN booking_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.booking_booking_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 219 (class 1259 OID 16451)
-- Name: destination; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.destination (
    destination_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    location character varying(150) NOT NULL,
    image_uuid character varying(255)
);


ALTER TABLE public.destination OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16456)
-- Name: destination_destination_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.destination ALTER COLUMN destination_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.destination_destination_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 221 (class 1259 OID 16457)
-- Name: driver_assignment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.driver_assignment (
    driver_assignment_id integer NOT NULL,
    assigned_date date DEFAULT CURRENT_TIMESTAMP,
    driver_id integer NOT NULL,
    booking_id integer NOT NULL
);


ALTER TABLE public.driver_assignment OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16461)
-- Name: driver_assignment_driver_assignment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.driver_assignment ALTER COLUMN driver_assignment_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.driver_assignment_driver_assignment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 223 (class 1259 OID 16462)
-- Name: feedback; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.feedback (
    feedback_id integer NOT NULL,
    rating integer,
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tourist_id integer NOT NULL,
    package_id integer NOT NULL,
    CONSTRAINT feedback_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.feedback OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16469)
-- Name: feedback_feedback_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.feedback ALTER COLUMN feedback_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.feedback_feedback_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 225 (class 1259 OID 16470)
-- Name: guide_assignment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.guide_assignment (
    guide_assignment_id integer NOT NULL,
    assigned_date date DEFAULT CURRENT_TIMESTAMP,
    guide_id integer NOT NULL,
    booking_id integer NOT NULL
);


ALTER TABLE public.guide_assignment OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16474)
-- Name: guide_assignment_guide_assignment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.guide_assignment ALTER COLUMN guide_assignment_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.guide_assignment_guide_assignment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 227 (class 1259 OID 16475)
-- Name: hotel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hotel (
    hotel_id integer NOT NULL,
    name character varying(150) NOT NULL,
    location character varying(150) NOT NULL,
    contact_no character varying(20),
    rating integer,
    description text,
    image_uuid character varying(255),
    CONSTRAINT hotel_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.hotel OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16479)
-- Name: hotel_hotel_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.hotel ALTER COLUMN hotel_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.hotel_hotel_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 229 (class 1259 OID 16480)
-- Name: hotel_reservation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hotel_reservation (
    reservation_id integer NOT NULL,
    check_in date NOT NULL,
    check_out date NOT NULL,
    status public.reservation_status DEFAULT 'Reserved'::public.reservation_status,
    booking_id integer NOT NULL,
    room_type_id integer NOT NULL,
    rooms_count integer DEFAULT 1,
    CONSTRAINT hotel_reservation_check CHECK ((check_out > check_in))
);


ALTER TABLE public.hotel_reservation OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16485)
-- Name: hotel_reservation_reservation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.hotel_reservation ALTER COLUMN reservation_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.hotel_reservation_reservation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 244 (class 1259 OID 16674)
-- Name: inquiry; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inquiry (
    inquiry_id integer NOT NULL,
    name character varying(150) NOT NULL,
    contact character varying(150) NOT NULL,
    subject character varying(200) NOT NULL,
    content text NOT NULL,
    status public.inquiry_status DEFAULT 'Pending'::public.inquiry_status,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.inquiry OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 16673)
-- Name: inquiry_inquiry_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.inquiry ALTER COLUMN inquiry_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.inquiry_inquiry_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 231 (class 1259 OID 16494)
-- Name: itinerary; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.itinerary (
    itinerary_id integer NOT NULL,
    day_number integer NOT NULL,
    activity text NOT NULL,
    package_id integer NOT NULL,
    CONSTRAINT itinerary_day_number_check CHECK ((day_number > 0))
);


ALTER TABLE public.itinerary OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16500)
-- Name: itinerary_itinerary_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.itinerary ALTER COLUMN itinerary_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.itinerary_itinerary_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 233 (class 1259 OID 16501)
-- Name: notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification (
    notification_id integer NOT NULL,
    message text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id integer NOT NULL
);


ALTER TABLE public.notification OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16507)
-- Name: notification_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.notification ALTER COLUMN notification_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.notification_notification_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 235 (class 1259 OID 16508)
-- Name: payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment (
    payment_id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    payment_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    method character varying(50) NOT NULL,
    status public.payment_status DEFAULT 'Pending'::public.payment_status,
    booking_id integer NOT NULL,
    CONSTRAINT payment_amount_check CHECK ((amount >= (0)::numeric))
);


ALTER TABLE public.payment OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 16514)
-- Name: payment_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.payment ALTER COLUMN payment_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.payment_payment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 237 (class 1259 OID 16515)
-- Name: room_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.room_type (
    room_type_id integer NOT NULL,
    type_name character varying(100) NOT NULL,
    price_per_night numeric(10,2) NOT NULL,
    hotel_id integer NOT NULL,
    CONSTRAINT room_type_price_per_night_check CHECK ((price_per_night >= (0)::numeric))
);


ALTER TABLE public.room_type OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 16519)
-- Name: room_type_room_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.room_type ALTER COLUMN room_type_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.room_type_room_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 239 (class 1259 OID 16520)
-- Name: tour_package; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tour_package (
    package_id integer NOT NULL,
    title character varying(150) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    available_slots integer NOT NULL,
    destination_id integer NOT NULL,
    start_date date,
    end_date date,
    capacity integer DEFAULT 0 NOT NULL,
    image_uuids jsonb,
    CONSTRAINT tour_package_available_slots_check CHECK ((available_slots >= 0)),
    CONSTRAINT tour_package_price_check CHECK ((price >= (0)::numeric))
);


ALTER TABLE public.tour_package OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 16528)
-- Name: tour_package_package_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.tour_package ALTER COLUMN package_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tour_package_package_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 241 (class 1259 OID 16529)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(255) NOT NULL,
    phone character varying(20),
    role public.user_role NOT NULL,
    status public.user_status DEFAULT 'Active'::public.user_status,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    price_per_day numeric(10,2) DEFAULT 0,
    image_uuid character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 16536)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN user_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 4751 (class 2606 OID 16538)
-- Name: booking booking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_pkey PRIMARY KEY (booking_id);


--
-- TOC entry 4755 (class 2606 OID 16540)
-- Name: destination destination_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.destination
    ADD CONSTRAINT destination_pkey PRIMARY KEY (destination_id);


--
-- TOC entry 4757 (class 2606 OID 16542)
-- Name: driver_assignment driver_assignment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_assignment
    ADD CONSTRAINT driver_assignment_pkey PRIMARY KEY (driver_assignment_id);


--
-- TOC entry 4761 (class 2606 OID 16544)
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (feedback_id);


--
-- TOC entry 4766 (class 2606 OID 16546)
-- Name: guide_assignment guide_assignment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guide_assignment
    ADD CONSTRAINT guide_assignment_pkey PRIMARY KEY (guide_assignment_id);


--
-- TOC entry 4770 (class 2606 OID 16548)
-- Name: hotel hotel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hotel
    ADD CONSTRAINT hotel_pkey PRIMARY KEY (hotel_id);


--
-- TOC entry 4772 (class 2606 OID 16550)
-- Name: hotel_reservation hotel_reservation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hotel_reservation
    ADD CONSTRAINT hotel_reservation_pkey PRIMARY KEY (reservation_id);


--
-- TOC entry 4794 (class 2606 OID 16682)
-- Name: inquiry inquiry_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inquiry
    ADD CONSTRAINT inquiry_pkey PRIMARY KEY (inquiry_id);


--
-- TOC entry 4775 (class 2606 OID 16554)
-- Name: itinerary itinerary_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itinerary
    ADD CONSTRAINT itinerary_pkey PRIMARY KEY (itinerary_id);


--
-- TOC entry 4779 (class 2606 OID 16556)
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (notification_id);


--
-- TOC entry 4782 (class 2606 OID 16558)
-- Name: payment payment_booking_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_booking_id_key UNIQUE (booking_id);


--
-- TOC entry 4784 (class 2606 OID 16560)
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (payment_id);


--
-- TOC entry 4786 (class 2606 OID 16562)
-- Name: room_type room_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_type
    ADD CONSTRAINT room_type_pkey PRIMARY KEY (room_type_id);


--
-- TOC entry 4788 (class 2606 OID 16564)
-- Name: tour_package tour_package_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_package
    ADD CONSTRAINT tour_package_pkey PRIMARY KEY (package_id);


--
-- TOC entry 4777 (class 2606 OID 16566)
-- Name: itinerary unique_day_per_package; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itinerary
    ADD CONSTRAINT unique_day_per_package UNIQUE (package_id, day_number);


--
-- TOC entry 4759 (class 2606 OID 16568)
-- Name: driver_assignment unique_driver_booking; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_assignment
    ADD CONSTRAINT unique_driver_booking UNIQUE (driver_id, booking_id);


--
-- TOC entry 4764 (class 2606 OID 16570)
-- Name: feedback unique_feedback_per_user; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT unique_feedback_per_user UNIQUE (tourist_id, package_id);


--
-- TOC entry 4768 (class 2606 OID 16572)
-- Name: guide_assignment unique_guide_booking; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guide_assignment
    ADD CONSTRAINT unique_guide_booking UNIQUE (guide_id, booking_id);


--
-- TOC entry 4790 (class 2606 OID 16574)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4792 (class 2606 OID 16576)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4752 (class 1259 OID 16577)
-- Name: idx_booking_package; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_booking_package ON public.booking USING btree (package_id);


--
-- TOC entry 4753 (class 1259 OID 16578)
-- Name: idx_booking_tourist; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_booking_tourist ON public.booking USING btree (tourist_id);


--
-- TOC entry 4762 (class 1259 OID 16579)
-- Name: idx_feedback_package; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_feedback_package ON public.feedback USING btree (package_id);


--
-- TOC entry 4780 (class 1259 OID 16580)
-- Name: idx_payment_booking; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payment_booking ON public.payment USING btree (booking_id);


--
-- TOC entry 4773 (class 1259 OID 16581)
-- Name: idx_reservation_booking; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservation_booking ON public.hotel_reservation USING btree (booking_id);


--
-- TOC entry 4797 (class 2606 OID 16582)
-- Name: driver_assignment fk_booking_driver; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_assignment
    ADD CONSTRAINT fk_booking_driver FOREIGN KEY (booking_id) REFERENCES public.booking(booking_id) ON DELETE CASCADE;


--
-- TOC entry 4801 (class 2606 OID 16587)
-- Name: guide_assignment fk_booking_guide; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guide_assignment
    ADD CONSTRAINT fk_booking_guide FOREIGN KEY (booking_id) REFERENCES public.booking(booking_id) ON DELETE CASCADE;


--
-- TOC entry 4807 (class 2606 OID 16592)
-- Name: payment fk_booking_payment; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT fk_booking_payment FOREIGN KEY (booking_id) REFERENCES public.booking(booking_id) ON DELETE CASCADE;


--
-- TOC entry 4803 (class 2606 OID 16597)
-- Name: hotel_reservation fk_booking_reservation; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hotel_reservation
    ADD CONSTRAINT fk_booking_reservation FOREIGN KEY (booking_id) REFERENCES public.booking(booking_id) ON DELETE CASCADE;


--
-- TOC entry 4809 (class 2606 OID 16602)
-- Name: tour_package fk_destination; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_package
    ADD CONSTRAINT fk_destination FOREIGN KEY (destination_id) REFERENCES public.destination(destination_id) ON DELETE CASCADE;


--
-- TOC entry 4798 (class 2606 OID 16607)
-- Name: driver_assignment fk_driver; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_assignment
    ADD CONSTRAINT fk_driver FOREIGN KEY (driver_id) REFERENCES public.users(user_id) ON DELETE RESTRICT;


--
-- TOC entry 4802 (class 2606 OID 16612)
-- Name: guide_assignment fk_guide; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guide_assignment
    ADD CONSTRAINT fk_guide FOREIGN KEY (guide_id) REFERENCES public.users(user_id) ON DELETE RESTRICT;


--
-- TOC entry 4808 (class 2606 OID 16617)
-- Name: room_type fk_hotel; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_type
    ADD CONSTRAINT fk_hotel FOREIGN KEY (hotel_id) REFERENCES public.hotel(hotel_id) ON DELETE CASCADE;


--
-- TOC entry 4795 (class 2606 OID 16622)
-- Name: booking fk_package_booking; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT fk_package_booking FOREIGN KEY (package_id) REFERENCES public.tour_package(package_id) ON DELETE RESTRICT;


--
-- TOC entry 4799 (class 2606 OID 16627)
-- Name: feedback fk_package_feedback; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT fk_package_feedback FOREIGN KEY (package_id) REFERENCES public.tour_package(package_id) ON DELETE CASCADE;


--
-- TOC entry 4805 (class 2606 OID 16632)
-- Name: itinerary fk_package_itinerary; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itinerary
    ADD CONSTRAINT fk_package_itinerary FOREIGN KEY (package_id) REFERENCES public.tour_package(package_id) ON DELETE CASCADE;


--
-- TOC entry 4804 (class 2606 OID 16637)
-- Name: hotel_reservation fk_room_type; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hotel_reservation
    ADD CONSTRAINT fk_room_type FOREIGN KEY (room_type_id) REFERENCES public.room_type(room_type_id) ON DELETE RESTRICT;


--
-- TOC entry 4796 (class 2606 OID 16642)
-- Name: booking fk_tourist; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT fk_tourist FOREIGN KEY (tourist_id) REFERENCES public.users(user_id) ON DELETE RESTRICT;


--
-- TOC entry 4800 (class 2606 OID 16647)
-- Name: feedback fk_tourist_feedback; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT fk_tourist_feedback FOREIGN KEY (tourist_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4806 (class 2606 OID 16657)
-- Name: notification fk_user_notification; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT fk_user_notification FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


-- Completed on 2026-05-24 23:35:08

-- Insert default admin password: admin123
INSERT INTO public.users (name, email, password, phone, role, status) 
VALUES ('Admin', 'admin@amal-holidays.com', '$2b$10$XHLsBGg7iHcxnw6nYekHYO6Em2/tGRMdyijDfu6wOWu3x4zEZ1R2m', '0711753053', 'Manager', 'Active');

--
-- PostgreSQL database dump complete
--

\unrestrict jdN0gVXGvBImK3UjNxLunt1kCGmytcaVSVl1XLJWJVLteB3Pn8wCwuCNVDaer3M
